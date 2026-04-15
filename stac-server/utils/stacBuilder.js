const { Particle } = require('../models/particle');
const { Sample } = require('../models/sample');

/**
 * Build a STAC Collection from a Sample MongoDB document
 * Collection = Sample (une collection par échantillon)
 * @param {Object} sample - Mongoose Sample document
 * @returns {Object} STAC Collection
 */
const buildStacCollection = async (sample) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5004';
  
  // Compter les particules valides pour ce sample
  const particleCount = await Particle.countDocuments({ 
    sample_code: sample.sample_code,
    faulty_image: { $ne: true }
  });

  // Récupérer les statistiques des particules pour les summaries
  const particles = await Particle.find({ 
    sample_code: sample.sample_code,
    faulty_image: { $ne: true }
  }).lean();

  // Calculer les summaries à partir des particules
  const mainTypeCounts = {};
  const subTypeCounts = {};
  particles.forEach(p => {
    if (p.main_type) {
      Object.keys(p.main_type).forEach(type => {
        if (p.main_type[type] > 0) {
          mainTypeCounts[type] = (mainTypeCounts[type] || 0) + 1;
        }
      });
    }
    if (p.sub_type) {
      subTypeCounts[p.sub_type] = (subTypeCounts[p.sub_type] || 0) + 1;
    }
  });
  
  // Parser les coordonnées
  const lon = Number.parseFloat(sample.sample_lon);
  const lat = Number.parseFloat(sample.sample_lat);
  
  if (Number.isNaN(lon) || Number.isNaN(lat)) {
    throw new TypeError(`Invalid coordinates for sample ${sample.sample_code}`);
  }
  
  const sampleDate = sample.sample_date ? new Date(sample.sample_date).toISOString() : null;
  
  return {
    id: sample.sample_code,
    type: "Collection",
    stac_version: "1.0.0",
    stac_extensions: [
      "https://stac-extensions.github.io/scientific/v1.0.0/schema.json"
    ],
    title: `${sample.volc_name || 'Unknown Volcano'} - Sample ${sample.sample_code}`,
    description: `Volcanic ash particle collection from ${sample.volc_name || 'unknown volcano'} eruption. Contains ${particleCount} analyzed particles with microscope images and morphological/textural data.`,
    keywords: [
      "volcanic ash",
      "particles",
      "microscopy",
      sample.volc_name,
      sample.sample_code
    ],
    license: "CC-BY-4.0 AND ODbL-1.0",
    providers: [
        {
            name: "Institut de Physique du Globe de Paris (IPGP)",
            roles: ["producer", "licensor", "host"],
            url: "https://www.ipgp.fr",
            ror: "https://ror.org/004gzqz66"
        },
        {
            name: "Earth Observatory of Singapore (EOS)",
            roles: ["producer"],
            url: "https://earthobservatory.sg/",
            ror: "https://ror.org/01167a838"
        },
        {
            name: "Nanyang Technological University (NTU)",
            roles: ["producer"],
            url: "https://ntu.edu.sg/",
            ror: "https://ror.org/02e7b5302"
        }
    ],
    extent: {
      spatial: {
        bbox: [[lon, lat, lon, lat]]
      },
      temporal: {
        interval: [[sampleDate, sampleDate]]
      }
    },
    // Scientific Extension
    "sci:doi": "10.18715/ipgp.2024.lx32oxw9",
    "sci:citation": "Version 0.1 of Dataset published 2024 in Centre de données de l'Institut de Physique du Globe de Paris",
    "sci:publications": [
      {
        "doi": "10.1038/s41597-025-04942-9",
        "citation": "Benet, D., Costa, F., Migadel, K. et al. 2025. A repository-hosted dataset of volcanic ash particle images and features. Scientific Data, 12, 681."
      },
      {
        "doi": "10.1029/2023GC011224",
        "citation": "Benet, D., Costa, F., Widiwijayanti, C. 2024. Volcanic ash classification through Machine Learning. Geochemistry, Geophysics, Geosystems."
      },
      {
        "doi": "10.1007/s00445-023-01695-4",
        "citation": "Benet, D., Costa, F., Widiwijayanti, C., et al. 2024. VolcAshDB: a Volcanic Ash DataBase of classified particle images and features. Bulletin of Volcanology, 86(1), pp.1-30."
      }
    ],
    // Custom VolcAsh properties
    "volcash:particle_count": particleCount,
    "volcash:volcano_number": sample.volc_num || null,
    "volcash:volcano_name": sample.volc_name || null,
    "volcash:sample_code": sample.sample_code || null,
    "volcash:technique": sample.sample_techn || null,
    "volcash:collector": sample.sample_collector || null,
    "volcash:surface": sample.sample_surf || null,
    "volcash:laboratory_procedure": sample.lab_procedure || null,
    // Summaries - Overview of property values across all Items in this Collection
    summaries: {
      // Particle count
      "volcash:particle_count": particleCount,
      // Main types with counts (e.g., "320 lithic", "150 juvenile")
      "volcash:main_type": Object.entries(mainTypeCounts)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([type, count]) => `${count} ${type}`),
      // Sub types with counts (e.g., "10 standard lithic", "5 pyroxene")
      "volcash:sub_type": Object.entries(subTypeCounts)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([type, count]) => `${count} ${type}`),
      // Volcano information (constant across all Items in this Collection)
      "volcash:volcano_number": [sample.volc_num || null],
      "volcash:volcano_name": [sample.volc_name || null],
      "volcash:sample_code": [sample.sample_code || null]
    },
    links: [
        {
            rel: "self",
            type: "application/json",
            href: `${baseUrl}/collections/${sample.sample_code}`
        },
        {
            rel: "root",
            type: "application/json",
            href: `${baseUrl}/`
        },
        {
            rel: "parent",
            type: "application/json",
            href: `${baseUrl}/`
        },
        {
            rel: "items",
            type: "application/geo+json",
            href: `${baseUrl}/collections/${sample.sample_code}/items`
        },
        {
            rel: "license",
            type: "text/html",
            href: "https://creativecommons.org/licenses/by/4.0/",
            title: "Creative Commons Attribution 4.0 International"
        },
        {
            rel: "license",
            type: "text/html",
            href: "https://spdx.org/licenses/ODbL-1.0.html",
            title: "Open Data Commons Open Database License v1.0"
        }
    ]
  };
};

/**
 * Build a STAC Item from a Particle MongoDB document
 * Item = Particle (chaque particule est un item STAC)
 * @param {Object} particle - Mongoose Particle document
 * @param {Object} sample - Mongoose Sample document (parent)
 * @returns {Object} STAC Item (GeoJSON Feature)
 */
const buildParticleItem = (particle, sample) => {
  const baseUrl = process.env.BASE_URL;
  const apiUrl = process.env.API_BASE_URL;
  const backendUrl = process.env.BACK_END_URL;
  
  // Parser les coordonnées du sample (héritage)
  const lon = Number.parseFloat(sample.sample_lon);
  const lat = Number.parseFloat(sample.sample_lat);
  
  if (Number.isNaN(lon) || Number.isNaN(lat)) {
    throw new TypeError(`Invalid coordinates for sample ${sample.sample_code}`);
  }
  
  const sampleDate = sample.sample_date ? new Date(sample.sample_date).toISOString() : null;
  
  // Construire l'ID unique de la particle
  const particleId = particle.imgURL 
    ? particle.imgURL.replace('.png', '').replace('.jpg', '') 
    : `${sample.sample_code}_${particle.id}`;
  
  return {
    stac_version: "1.0.0",
    stac_extensions: [
      "https://stac-extensions.github.io/scientific/v1.0.0/schema.json"
    ],
    type: "Feature",
    id: particleId,
    collection: sample.sample_code,
    geometry: {
      type: "Point",
      coordinates: [lon, lat]
    },
    bbox: [lon, lat, lon, lat],
    properties: {
      // Required datetime
      datetime: sampleDate,
      
      // Scientific Extension - inherited from collection
      "sci:doi": "10.18715/ipgp.2024.lx32oxw9",
      "sci:citation": "Version 0.1 of Dataset published 2024 in Centre de données de l'Institut de Physique du Globe de Paris",
      "sci:publications": [
        {
          "doi": "10.1038/s41597-025-04942-9",
          "citation": "Benet, D., Costa, F., Migadel, K. et al. 2025. A repository-hosted dataset of volcanic ash particle images and features. Scientific Data, 12, 681."
        },
        {
          "doi": "10.1029/2023GC011224",
          "citation": "Benet, D., Costa, F., Widiwijayanti, C. 2024. Volcanic ash classification through Machine Learning. Geochemistry, Geophysics, Geosystems."
        },
        {
          "doi": "10.1007/s00445-023-01695-4",
          "citation": "Benet, D., Costa, F., Widiwijayanti, C., et al. 2024. VolcAshDB: a Volcanic Ash DataBase of classified particle images and features. Bulletin of Volcanology, 86(1), pp.1-30."
        }
      ],
      
      // Classification (main_type is an object with percentages)
      "volcash:main_type": particle.main_type || null,
      "volcash:sub_type": particle.sub_type || null,
      "volcash:sample_code": particle.sample_code,
      "volcash:volcano_number": particle.volc_num || null,
      "volcash:volcano_name": particle.volc_name || null,
    },
    assets: {
      image: {
        href: `${backendUrl}/images/particles/${particle.imgURL}`,
        type: "image/png",
        title: "Particle Microscope Image",
        description: "High-resolution microscope image of volcanic ash particle",
        roles: ["data", "visual"],
      },
      metadata: {
        href: `${apiUrl}/particles/${particle.imgURL}`,
        type: "application/json",
        title: "Complete Particle Metadata",
        description: "Full morphological, textural, and optical analysis data",
        roles: ["metadata"]
      },
      sample: {
        href: `${apiUrl}/samples/${sample.sample_code}`,
        type: "application/json",
        title: "Parent Sample Metadata",
        description: "Complete metadata of the parent sample including eruption and volcano information",
        roles: ["metadata"]
      }
    },
    links: [
        {
            rel: "self",
            type: "application/geo+json",
            href: `${baseUrl}/collections/${sample.sample_code}/items/${particleId}`
        },
        {
            rel: "parent",
            type: "application/json",
            href: `${baseUrl}/collections/${sample.sample_code}`
        },
        {
            rel: "collection",
            type: "application/json",
            href: `${baseUrl}/collections/${sample.sample_code}`
        },
        {
            rel: "root",
            type: "application/json",
            href: `${baseUrl}/`
        },
        {
            rel: "license",
            type: "text/html",
            href: "https://creativecommons.org/licenses/by/4.0/",
            title: "Creative Commons Attribution 4.0 International"
        },
        {
            rel: "license",
            type: "text/html",
            href: "https://spdx.org/licenses/ODbL-1.0.html",
            title: "Open Data Commons Open Database License v1.0"
        }
    ]
  };
};

module.exports = { 
  buildStacCollection,
  buildParticleItem 
};
