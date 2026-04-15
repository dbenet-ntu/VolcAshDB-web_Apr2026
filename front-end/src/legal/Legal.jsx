import { CustomTypography, Container, LegalContainer, Title, Li } from './Legal.styles'

/**
 * License component renders the legal information and privacy policy of the website.
 * It includes sections on legal information, privacy policy, data protection, and cookies.
 * 
 * @returns {JSX.Element} The rendered License component.
 */
const License = () => {

      return (
            <Container>
                  <LegalContainer>
                        {/* Title for legal information section */}
                        <Title>Legal Information</Title>
                        {/* Editor section */}
                        <h3><strong>Editor</strong></h3>
                        <CustomTypography>This website is published by the Institut de physique du globe de Paris (IPGP), a major higher education and research establishment, whose head office is located at 1, rue Jussieu - 75238 Paris cedex 05.</CustomTypography>
                        
                        <CustomTypography>Telephone number: +33 (0)1 83 95 74 00</CustomTypography>

                        {/* Hosting section */}
                        <h3><strong>Hosting</strong></h3>
                        <CustomTypography>IPGP Data Center department</CustomTypography>
                              

                        {/* Title for privacy policy and data protection section */}
                        <Title>Privacy policy / Data protection</Title>
                        {/* Intellectual property and reproduction rights section */}
                        <h3><strong>Intellectual property and reproduction rights</strong></h3>
                        <CustomTypography>In accordance with the Code governing relations between the public and the administration (CRPA) and in particular article <a href='https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033205794'>L533-4 of the Research Code</a>, "research data resulting from the current activity of research establishments" are subject to the principles of openness by default and free re-use.</CustomTypography>
                        
                        <CustomTypography>However, partial or complete re-use is free, provided that the minimum conditions set out in article <a href='https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032255220'>L. 322-1 of the CRPA</a> are met: mention of source, non-alteration and non-distortion, mention of the date of update.</CustomTypography>

                        <CustomTypography>In order to help the user to understand his rights, we apply some <a href='https://www.data.gouv.fr/fr/pages/legal/licences/'>re-use licenses proposed by the French gouvernment</a>.</CustomTypography>
                        
                        {/* Open Data Commons Open Database License (ODbL) section */}
                        <h3><strong>Open Data Commons Open Database License (ODbL)</strong></h3>
                        
                        <CustomTypography>Our database is licensed under the Open Data Commons Open Database License (ODbL) to ensure that the same freedom of use, modification, and sharing is maintained for others. This aligns with the fundamental purpose of research, which is to disseminate knowledge widely and facilitate future collaboration. By adopting the ODbL, we support the ethos of open access and the free exchange of information, fostering an environment where data can be freely utilized and built upon to advance research and innovation.</CustomTypography>
                        <CustomTypography>This is a human-readable summary of the <a href="https://spdx.org/licenses/ODbL-1.0.html#licenseText">ODbL 1.0 license</a>. Please see the disclaimer below.</CustomTypography>
                        <CustomTypography>You are free:</CustomTypography>
                        <ul>
                              <Li><em>To share</em>: To copy, distribute and use the database.</Li>
                              <Li><em>To create</em>: To produce works from the database.</Li>
                              <Li><em>To adapt</em>: To modify, transform and build upon the database.</Li>
                        </ul>
                        <CustomTypography>As long as you:</CustomTypography>
                        <ul>
                              <Li><em>Attribute</em>: You must attribute any public use of the database, or works produced from the database, in the manner specified in the ODbL. For any use or redistribution of the database, or works produced from it, you must make clear to others the license of the database and keep intact any notices on the original database.</Li>
                              <Li><em>Share-Alike</em>: If you publicly use any adapted version of this database, or works produced from an adapted database, you must also offer that adapted database under the ODbL.</Li>
                              <Li><em>Keep open</em>: If you redistribute the database, or an adapted version of it, then you may use technological measures that restrict the work (such as DRM) as long as you also redistribute a version without such measures.</Li>
                        </ul>
                        
                        {/* Disclaimer section */} 
                        <CustomTypography><strong>Disclaimer</strong></CustomTypography>
                        <CustomTypography>This is not a license. It is simply a handy reference for understanding the <a href="https://spdx.org/licenses/ODbL-1.0.html#licenseText">ODbL 1.0</a> — it is a human-readable expression of some of its key terms. This document has no legal value, and its contents do not appear in the actual license. Read the <a href="https://spdx.org/licenses/ODbL-1.0.html#licenseText">full ODbL 1.0 license text</a> for the exact terms that apply.</CustomTypography>
                        
                        {/* Open License section */}
                        <h3><strong>Open License </strong></h3>
                        
                        <CustomTypography>Our database is licensed under the Open License according to <a href='https://www.data.gouv.fr/fr/pages/legal/licences/'>the French law</a>. This licence has been designed to be compatible with any free licence that at least requires an acknowledgement of authorship, and specifically with the previous version of this licence as well as with the following licences: United Kingdom’s “Open Government Licence” (OGL), Creative Commons’ “Creative Commons Attribution” (CC-BY) and Open Knowledge Foundation’s “Open Data Commons Attribution” (ODC-BY). </CustomTypography>
                        <CustomTypography>This is a human-readable summary of the <a href="https://etalab.gouv.fr/wp-content/uploads/2018/11/open-licence.pdf">Open License</a>. Please see the disclaimer below.</CustomTypography>
                        <CustomTypography>The “Grantor” grants the “Reuser” the free, non-exclusive right to “Reuse” the “Information” subject of this licence, for commercial or non-commercial purposes, worldwide and for an unlimited period, in accordance with the conditions stated below. </CustomTypography>
                        <CustomTypography>You are free:</CustomTypography>
                        <ul>
                              <Li> To reproduce it, copy it. </Li>
                              <Li> To adapt, modify, retrieve and transform it in order to create “derived information”, products and services.</Li>
                              <Li> To share, disseminate, redistribute, publish and transmit it.</Li>
                              <Li> To exploit it for commercial purposes, e.g., by combining it with other information, or by including it in his/her own product or application. </Li>
                        </ul>
                        <CustomTypography>As long as:</CustomTypography>
                        <CustomTypography>An acknowledgement of the authorship of the “Information”: its source (at least, the name of the “Grantor”) and the date of the most recent update of the reused “Information”. Specifically, the “Reuser” may satisfy this condition by pointing, via a hypertext link, to the source of “the Information” and so supplying an actual acknowledgement of its authorship</CustomTypography>
                        <CustomTypography>This acknowledgement of authorship does not confer any official status on the “Reuse” of the “Information”, and must not suggest any sort of recognition or endorsement on the part of the “Grantor”, or any other public entity, of the “Reuser”or of their “Reuse”. </CustomTypography>
                        
                        {/* Disclaimer section */} 
                        <CustomTypography><strong>Disclaimer</strong></CustomTypography>
                        <CustomTypography>This is not a license. It is simply a handy reference for understanding the <a href="https://etalab.gouv.fr/wp-content/uploads/2018/11/open-licence.pdf">Open License 2.0</a> — it is a human-readable expression of some of its key terms. This document has no legal value, and its contents do not appear in the actual license. Read the full text of the <a href="https://etalab.gouv.fr/wp-content/uploads/2018/11/open-licence.pdf">Open License 2.0</a> for the exact terms that apply.</CustomTypography>                      

                        {/* CC-BY License section */}
                        <h3><strong>CC-BY License </strong></h3>
                        
                        <CustomTypography>Our database is licensed under the <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0 license</a>. Since the Open License is recognised only in France, we decided to apply the CC-BY license so that the rights applied to our data would be recognised internationally.</CustomTypography>
                        <CustomTypography>This is a human-readable summary of the <a href="https://etalab.gouv.fr/wp-content/uploads/2018/11/open-licence.pdf">Open License</a>. Please see the disclaimer below.</CustomTypography>
                        <CustomTypography>The “Grantor” grants the “Reuser” the free, non-exclusive right to “Reuse” the “Information” subject of this licence, for commercial or non-commercial purposes, worldwide and for an unlimited period, in accordance with the conditions stated below. </CustomTypography>
                        <CustomTypography>You are free:</CustomTypography>
                        <ul>
                              <Li><em>To share</em>: copy and redistribute the material in any medium or format for any purpose, even commercially.</Li>
                              <Li><em>To adapt</em>: remix, transform, and build upon the material for any purpose, even commercially.</Li>
                        </ul>
                        <CustomTypography>As long as:</CustomTypography>
                        <ul>
                              <Li><em>Attribute</em>: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.</Li>
                        </ul>     

                        {/* Disclaimer section */} 
                        <CustomTypography><strong>Disclaimer</strong></CustomTypography>
                        <CustomTypography>This is not a license. It is simply a handy reference for understanding the <a href="https://creativecommons.org/licenses/by/4.0/legalcode.en">CC-BY License 4.0</a> — it is a human-readable expression of some of its key terms. This document has no legal value, and its contents do not appear in the actual license. Read the the full text of the <a href="https://creativecommons.org/licenses/by/4.0/legalcode.en">CC-BY 4.0 license</a> for the exact terms that apply.</CustomTypography>                      

                        {/* Protection and processing of personal data section */}
                        <h3><strong>Protection and processing of personal data</strong></h3>
                        <CustomTypography><strong>Compliance with current legislation</strong></CustomTypography>
                        <CustomTypography>The https://www.volcashdb.ipgp.fr website respects the privacy of Internet users and complies strictly with the laws in force on the protection of privacy and individual liberties. No personal information is collected without the user's knowledge, nor is it passed on to third parties. E-mails are not used in any way and are only kept for the time required to process them.</CustomTypography>
                        
                        {/* Cookies section */}
                        <CustomTypography><strong>Cookies</strong></CustomTypography>
                        <CustomTypography>When you visit the https://www.volcashdb.ipgp.fr website, cookies are placed on your computer, mobile or tablet.</CustomTypography>

                        <CustomTypography>These cookies are intended for audience measurement and do not collect any personal data. Audience measurement tools are deployed to obtain information about visitors' browsing habits, such as the number of visitors per day and the number of requests per day.</CustomTypography>
                        
                        <CustomTypography>In accordance with article <a href='https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000037813978'>82 of of law n°78-17 of 6 January 1978</a>, these cookies are limited to what is strictly necessary for the provision of the service and are therefore <a href='https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience'>exempt from consent.</a> To be exempt from consent, these tracers comply with the following conditions:</CustomTypography>

                        <ul>
                              <Li>
                                    <CustomTypography>Strictly limited purpose: Cookies are used solely to measure the audience for the site or application. This includes measuring performance, detecting navigation problems, optimising technical performance or the ergonomics of the site, estimating the power of the servers required and analysing the content consulted. The data collected is for the exclusive use of the site publisher.</CustomTypography>
                              </Li>
                              <Li>
                                    <CustomTypography>Production of anonymous statistical data: The data generated by these cookies is anonymous and used exclusively for statistical purposes.</CustomTypography>
                              </Li>
                        </ul>

                        On the other hand, to be exempt from consent, these trackers must not:

                        <ul>
                              <Li>
                                    <CustomTypography>Cross-checking of data: This must not lead to data being cross-checked with other processing operations or to data being passed on to third parties.</CustomTypography>
                              </Li>
                              <Li>
                                    <CustomTypography>Global tracking of browsing: They must not allow the global tracking of browsing by the user using different applications or browsing different websites. Any solution using the same identifier across several sites (for example, cookies deposited on a third-party domain loaded by several sites) to cross-reference, duplicate or measure a unified "reach" rate for content is excluded.</CustomTypography>
                              </Li>
                        </ul>
                        
                        <CustomTypography>By using our site, you accept the use of these cookies under the conditions described above. Thank you for your understanding and trust.</CustomTypography>

                        {/* Definition of a cookie section */}
                        <CustomTypography><strong>Definition of a cookie</strong></CustomTypography>
                        <CustomTypography>A cookie is a text file placed on your computer when you visit a website or view an advertisement. Its purpose is to collect information about your browsing habits and to provide you with services tailored to your terminal (computer, mobile or tablet). Cookies are managed by your web browser.</CustomTypography>

                  </LegalContainer>
            </Container>
      )
}

export default License

      