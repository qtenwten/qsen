import { useLanguage } from '../contexts/LanguageContext'
import SEO from '../components/SEO'
import ToolPageShell, { ToolPageHero } from '../components/ToolPageShell'
import './Terms.css'

function Terms() {
  const { t, language } = useLanguage()

  return (
    <>
      <SEO
        title={t('terms.title')}
        description={t('terms.description')}
        path={`/${language}/terms`}
      />

      <ToolPageShell className="terms-page">
        <ToolPageHero
          eyebrow={language === 'en' ? 'Legal' : 'Правовая информация'}
          title={t('terms.title')}
        />

        <div className="legal-content">
          {language === 'ru' ? (
            <>
              <section className="legal-section">
                <h2>1. Общие положения</h2>
                <p>1.1. Настоящие Правила пользования сайтом QSEN.RU (далее — «Правила») регулируют отношения между владельцем сайта QSEN.RU (далее — «Администрация») и любым лицом, осуществляющим доступ к сайту и использующим его сервисы (далее — «Пользователь»).</p>
                <p>1.2. Правила являются публичной офертой в соответствии со статьёй 437 Гражданского кодекса Российской Федерации. Акцептом оферты является фактическое использование сайта Пользователем.</p>
                <p>1.3. Администрация оставляет за собой право в любое время изменить условия настоящих Правил без предварительного уведомления Пользователя. Новая редакция Правил вступает в силу с момента её размещения на Сайте, если иное не предусмотрено новой редакцией.</p>
                <p>1.4. Использование Пользователем Сайта после вступления в силу изменений означает согласие Пользователя с новой редакцией Правил.</p>
                <p>1.5. Настоящие Правила вступают в силу с момента их публикации и действуют бессрочно до момента их отзыва Администрацией.</p>
              </section>

              <section className="legal-section">
                <h2>2. Предмет соглашения</h2>
                <p>2.1. Настоящие Правила определяют порядок использования сервисов сайта QSEN.RU, включая все инструменты, калькуляторы, генераторы и иные функциональные возможности (далее — «Сервисы»).</p>
                <p>2.2. Сайт QSEN.RU предоставляет Пользователям доступ к следующим категориям сервисов:</p>
                <ul>
                  <li>калькуляторы (НДС, дата разницы, сложный процент, ипотечный и др.);</li>
                  <li>генераторы (QR-кодов, паролей, случайных чисел, коротких ссылок);</li>
                  <li>инструменты для SEO-анализа сайтов;</li>
                  <li>конвертеры (сумма прописью и др.);</li>
                  <li>информационные материалы (статьи, руководства).</li>
                </ul>
                <p>2.3. Все сервисы Сайта предоставляются бесплатно и без регистрации.</p>
              </section>

              <section className="legal-section">
                <h2>3. Правовой статус сервисов</h2>
                <p>3.1. Сервисы сайта QSEN.RU носят информационный и инструментальный характер. Результаты вычислений, генерируемые сервисами (включая калькуляторы НДС, сумму прописью, иные расчёты), носят справочный характер и не являются официальным документом.</p>
                <p>3.2. Администрация не несёт ответственности за соответствие результатов, полученных с использованием Сервисов, требованиям законодательства, нормативных актов, стандартов или договорных обязательств Пользователя.</p>
                <p>3.3. Пользователь самостоятельно несёт ответственность за использование результатов, полученных через сервисы Сайта, в своих целях, включая принятие решений на основании таких результатов.</p>
                <p>3.4. Сервисы Сайта не являются профессиональными консультациями и не заменяют квалифицированную помощь специалистов. Пользователь не должен принимать значимые решения (финансовые, юридические, медицинские и др.), основываясь исключительно на результатах, полученных через Сайт.</p>
              </section>

              <section className="legal-section">
                <h2>4. Возрастные ограничения</h2>
                <p>4.1. Использование Сайта разрешено только лицам, достигшим возраста, с которого они могут самостоятельно заключать сделки в соответствии с законодательством Российской Федерации, или получившим согласие законного представителя.</p>
                <p>4.2. Если Пользователь не соответствует указанным требованиям, использование Сайта запрещено. Администрация не несёт ответственности за использование Сайта несовершеннолетними лицами без согласия законных представителей.</p>
              </section>

              <section className="legal-section">
                <h2>5. Порядок использования сервисов</h2>
                <p>5.1. Для использования сервисов Сайта Пользователю не требуется регистрация, создание учётной записи или предоставление персональных данных, за исключением случаев добровольного обращения через форму обратной связи.</p>
                <p>5.2. Все расчёты и генерация результатов осуществляются на стороне браузера Пользователя (client-side). Данные, вводимые Пользователем, не передаются на сервер и не сохраняются после завершения сеанса.</p>
                <p>5.3. Пользователь обязуется:</p>
                <ul>
                  <li>использовать Сайт и его сервисы только в законных целях;</li>
                  <li>не использовать Сайт для действий, нарушающих законодательство Российской Федерации или международные нормы;</li>
                  <li>не предпринимать попыток несанкционированного доступа к сервисам, серверному оборудованию или данным других пользователей;</li>
                  <li>не использовать автоматизированные скрипты, программы или иные средства для массового обращения к сервисам Сайта без письменного согласия Администрации;</li>
                  <li>не размещать на Сайте ссылки на материалы, содержащие запрещённую информацию;</li>
                  <li>не использовать Сайт для распространения спама, вредоносного программного обеспечения или иных действий, способных нарушить работу Сайта или причинить ущерб третьим лицам;</li>
                  <li>не использовать Сайт для автоматизированного сбора данных, включая парсинг контента, без письменного согласия Администрации;</li>
                  <li>не осуществлять обратную инженерию, декомпиляцию или дизассемблирование Сайта.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2>6. Изменение и прекращение сервиса</h2>
                <p>6.1. Администрация оставляет за собой право в любое время и без предварительного уведомления:</p>
                <ul>
                  <li>изменять состав, функциональность и условия работы Сервисов;</li>
                  <li>приостанавливать или прекращать работу отдельных Сервисов или Сайта в целом;</li>
                  <li>обновлять, модифицировать или удалять любой контент на Сайте;</li>
                  <li>изменять внешний вид, дизайн и структуру Сайта.</li>
                </ul>
                <p>6.2. Администрация не несёт ответственности за любые убытки, понесённые Пользователем в результате действий, указанных в п. 6.1 настоящих Правил.</p>
              </section>

              <section className="legal-section">
                <h2>7. Интеллектуальная собственность</h2>
                <p>7.1. Все элементы дизайна, тексты, графические изображения, логотипы, торговые марки и иные объекты интеллектуальной собственности, размещённые на Сайте, являются собственностью Администрации или используются ею на законных основаниях.</p>
                <p>7.2. Копирование, воспроизведение, распространение, переработка или иное использование элементов Сайта без письменного разрешения Администрации запрещено.</p>
                <p>7.3. Пользователь сохраняет права на данные (введённую информацию), которые он вводит для получения результатов через сервисы Сайта.</p>
              </section>

              <section className="legal-section">
                <h2>8. Ограничение ответственности</h2>
                <p>8.1. Сайт и его сервисы предоставляются «как есть» (as is) без каких-либо гарантий, явных или подразумеваемых.</p>
                <p>8.2. Администрация не гарантирует:</p>
                <ul>
                  <li>бесперебойную работу Сайта и его сервисов;</li>
                  <li>отсутствие ошибок или неточностей в работе сервисов;</li>
                  <li>достижение Пользователем ожидаемого результата при использовании сервисов;</li>
                  <li>пригодность сервисов для конкретных целей или задач Пользователя;</li>
                  <li>доступность Сайта в любое конкретное время или из любой конкретной географической локации.</li>
                </ul>
                <p>8.3. Администрация не несёт ответственности за:</p>
                <ul>
                  <li>любые убытки (прямые, косвенные, случайные, штрафные санкции, упущенную выгоду), возникшие у Пользователя в результате использования или невозможности использования Сайта;</li>
                  <li>действия третьих лиц, включая других Пользователей;</li>
                  <li>несанкционированный доступ к данным Пользователя, если такой доступ стал результатом действий самого Пользователя;</li>
                  <li>работоспособность внешних сервисов или API, к которым Сайт может обращаться для выполнения отдельных функций;</li>
                  <li>убытки, возникшие в результате вирусов, атак хакеров, сбоев оборудования или иных технических проблем.</li>
                </ul>
                <p>8.4. Максимальная совокупная ответственность Администрации перед Пользователем ограничивается суммой 1000 (одна тысяча) рублей.</p>
              </section>

              <section className="legal-section">
                <h2>9. Возмещение убытков</h2>
                <p>9.1. Пользователь обязуется возместить Администрации и связанным с ней лицам любые убытки, претензии, требования, ущерб, расходы (включая разумные юридические расходы), возникшие в результате:</p>
                <ul>
                  <li>нарушения Пользователем настоящих Правил;</li>
                  <li>использования Пользователем Сайта с нарушением законодательства;</li>
                  <li>действий Пользователя, повлёкших нарушение прав третьих лиц.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2>10. Внешние ссылки и сторонние сервисы</h2>
                <p>10.1. Сайт может содержать ссылки на внешние интернет-ресурсы, принадлежащие третьим лицам. Такие ссылки размещаются исключительно для удобства Пользователя.</p>
                <p>10.2. Администрация не несёт ответственности за содержание, политику конфиденциальности, условия использования или действия владельцев внешних интернет-ресурсов.</p>
                <p>10.3. Решение о переходе на внешние ресурсы и использовании их сервисов принимается Пользователем самостоятельно и на свой риск.</p>
              </section>

              <section className="legal-section">
                <h2>11. Использование файлов cookies и счётчиков</h2>
                <p>11.1. Сайт использует файлы cookies в соответствии с Политикой конфиденциальности, доступной по адресу <a href={`/${language}/privacy`}>Политика конфиденциальности</a>.</p>
                <p>11.2. Используя Сайт, Пользователь выражает согласие на обработку cookies в соответствии с настоящими Правилами и Политикой конфиденциальности.</p>
                <p>11.3. Для сбора статистики посещаемости и анализа использования Сайта могут применяться сторонние сервисы веб-аналитики. Подробная информация о принципах их работы и обрабатываемых данных представлена в Политике конфиденциальности.</p>
              </section>

              <section className="legal-section">
                <h2>12. Уведомления и связь с Администрацией</h2>
                <p>12.1. Все уведомления Пользователю считаются направленными с момента их размещения на Сайте.</p>
                <p>12.2. Пользователь может связаться с Администрацией через форму обратной связи на Сайте по адресу <a href={`/${language}/feedback`}>QSEN.RU/feedback</a>.</p>
                <p>12.3. Администрация обязуется рассмотреть обращение Пользователя в течение 30 (тридцати) календарных дней с момента его получения.</p>
              </section>

              <section className="legal-section">
                <h2>13. Невозможность уступки прав</h2>
                <p>13.1. Пользователь не вправе уступать свои права и обязанности по настоящим Правилам третьим лицам без письменного согласия Администрации.</p>
                <p>13.2. Администрация вправе уступить свои права и обязанности по настоящим Правилам любому третьему лицу без согласия Пользователя, уведомив его путём размещения информации на Сайте.</p>
              </section>

              <section className="legal-section">
                <h2>14. Применимое законодательство и разрешение споров</h2>
                <p>14.1. Настоящие Правила регулируются и толкуются в соответствии с законодательством Российской Федерации.</p>
                <p>14.2. Все споры, возникающие из отношений, регулируемых настоящими Правилами, разрешаются путём переговоров. Срок ответа на претензию составляет 30 (тридцать) календарных дней с момента её получения.</p>
                <p>14.3. Если спор не может быть решён путём переговоров, он передаётся на рассмотрение в суд по месту нахождения Администрации в соответствии с процессуальным законодательством Российской Федерации.</p>
              </section>

              <section className="legal-section">
                <h2>15. Заключительные положения</h2>
                <p>15.1. Если какое-либо положение настоящих Правил будет признано недействительным или не имеющим юридической силы, остальные положения остаются в полной силе и действии.</p>
                <p>15.2. Неиспользование Администрацией своих прав по настоящим Правилам не означает отказ от этих прав.</p>
                <p>15.3. Администрация оставляет за собой все права, явно не предоставленные Пользователю в настоящих Правилах.</p>
                <p>15.4. Все вопросы, не урегулированные настоящими Правилами, решаются в соответствии с законодательством Российской Федерации.</p>
              </section>

              <section className="legal-section">
                <h2>16. Реквизиты Администрации</h2>
                <p>Сайт: QSEN.RU</p>
                <p>Электронная почта для связи: <a href={`/${language}/feedback`}>форма обратной связи на сайте</a></p>
                <p className="legal-date">Дата публикации: 24 апреля 2026 года</p>
              </section>
            </>
          ) : (
            <>
              <section className="legal-section">
                <h2>1. General Provisions</h2>
                <p>1.1. These Terms of Service (hereinafter — "Terms") govern the relationship between the owner of the QSEN.RU website (hereinafter — "Administration") and any person accessing the website and using its services (hereinafter — "User").</p>
                <p>1.2. The Terms constitute a public offer in accordance with Article 437 of the Civil Code of the Russian Federation. The acceptance of the offer is the User's actual use of the website.</p>
                <p>1.3. The Administration reserves the right to modify these Terms at any time without prior notice to the User. The new version of the Terms takes effect from the moment it is posted on the Website, unless otherwise provided by the new version.</p>
                <p>1.4. The User's use of the Website after the amendments come into Force constitutes acceptance of the new version of the Terms.</p>
                <p>1.5. These Terms come into force upon publication and remain in effect indefinitely until withdrawn by the Administration.</p>
              </section>

              <section className="legal-section">
                <h2>2. Subject of the Agreement</h2>
                <p>2.1. These Terms define the procedure for using the services of the QSEN.RU website, including all tools, calculators, generators and other functionality (hereinafter — "Services").</p>
                <p>2.2. The QSEN.RU website provides users with access to the following categories of services:</p>
                <ul>
                  <li>calculators (VAT, date difference, compound interest, mortgage, etc.);</li>
                  <li>generators (QR codes, passwords, random numbers, short links);</li>
                  <li>SEO analysis tools;</li>
                  <li>converters (amount in words, etc.);</li>
                  <li>informational materials (articles, guides).</li>
                </ul>
                <p>2.3. All website services are provided free of charge and without registration.</p>
              </section>

              <section className="legal-section">
                <h2>3. Legal Status of Services</h2>
                <p>3.1. The QSEN.RU website services are informational and instrumental in nature. The results of calculations generated by the services (including VAT calculators, amounts in words, and other calculations) are for reference purposes only and do not constitute official documents.</p>
                <p>3.2. The Administration is not responsible for the compliance of results obtained through the Services with the requirements of legislation, regulations, standards, or the User's contractual obligations.</p>
                <p>3.3. The User is solely responsible for using the results obtained through the website's services for their purposes, including making decisions based on such results.</p>
                <p>3.4. The Website services are not professional advice and do not replace qualified assistance from specialists. The User should not make significant decisions (financial, legal, medical, etc.) based solely on results obtained through the Website.</p>
              </section>

              <section className="legal-section">
                <h2>4. Age Restrictions</h2>
                <p>4.1. Use of the Website is permitted only to persons who have reached the age at which they can independently enter into transactions under the legislation of the Russian Federation, or who have obtained consent from their legal representative.</p>
                <p>4.2. If the User does not meet these requirements, use of the Website is prohibited. The Administration is not responsible for the use of the Website by minors without the consent of their legal representatives.</p>
              </section>

              <section className="legal-section">
                <h2>5. Terms of Service Use</h2>
                <p>5.1. To use the website's services, the User does not need to register, create an account, or provide personal data, except in cases of voluntary contact through the feedback form.</p>
                <p>5.2. All calculations and result generation are performed on the User's browser side (client-side). The data entered by the User is not transmitted to the server and is not stored after the session ends.</p>
                <p>5.3. The User agrees to:</p>
                <ul>
                  <li>use the Website and its services only for lawful purposes;</li>
                  <li>not use the Website for actions that violate the legislation of the Russian Federation or international norms;</li>
                  <li>not attempt unauthorized access to services, server equipment, or other users' data;</li>
                  <li>not use automated scripts, programs, or other means for mass access to the Website's services without written consent of the Administration;</li>
                  <li>not post links to materials containing prohibited information on the Website;</li>
                  <li>not use the Website for spreading spam, malware, or other actions that may disrupt the Website's operation or harm third parties;</li>
                  <li>not use the Website for automated data collection, including content parsing, without written consent of the Administration;</li>
                  <li>not reverse engineer, decompile, or disassemble the Website.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2>6. Changes and Termination of Service</h2>
                <p>6.1. The Administration reserves the right at any time and without prior notice to:</p>
                <ul>
                  <li>change the composition, functionality, and conditions of the Services;</li>
                  <li>suspend or terminate the operation of individual Services or the Website as a whole;</li>
                  <li>update, modify, or delete any content on the Website;</li>
                  <li>change the appearance, design, and structure of the Website.</li>
                </ul>
                <p>6.2. The Administration is not liable for any damages incurred by the User as a result of actions specified in clause 6.1 of these Terms.</p>
              </section>

              <section className="legal-section">
                <h2>7. Intellectual Property</h2>
                <p>7.1. All design elements, texts, graphic images, logos, trademarks, and other intellectual property objects placed on the Website are the property of the Administration or are used by it legally.</p>
                <p>7.2. Copying, reproduction, distribution, modification, or other use of the Website's elements without the written permission of the Administration is prohibited.</p>
                <p>7.3. The User retains rights to the data (input information) that they enter to obtain results through the Website's services.</p>
              </section>

              <section className="legal-section">
                <h2>8. Limitation of Liability</h2>
                <p>8.1. The Website and its services are provided "as is" without any warranties, express or implied.</p>
                <p>8.2. The Administration does not guarantee:</p>
                <ul>
                  <li>uninterrupted operation of the Website and its services;</li>
                  <li>absence of errors or inaccuracies in the services;</li>
                  <li>the User achieving expected results when using the services;</li>
                  <li>the suitability of services for the User's specific purposes or tasks;</li>
                  <li>availability of the Website at any specific time or from any specific geographical location.</li>
                </ul>
                <p>8.3. The Administration is not liable for:</p>
                <ul>
                  <li>any damages (direct, indirect, incidental, punitive damages, lost profits) incurred by the User as a result of using or inability to use the Website;</li>
                  <li>actions of third parties, including other Users;</li>
                  <li>unauthorized access to the User's data, if such access resulted from the User's own actions;</li>
                  <li>the performance of external services or APIs that the Website may access to perform certain functions;</li>
                  <li>damages resulting from viruses, hacker attacks, equipment failures, or other technical issues.</li>
                </ul>
                <p>8.4. The maximum aggregate liability of the Administration to the User is limited to 1000 (one thousand) rubles.</p>
              </section>

              <section className="legal-section">
                <h2>9. Indemnification</h2>
                <p>9.1. The User agrees to indemnify the Administration and related parties for any damages, claims, demands, losses, and expenses (including reasonable legal fees) arising from:</p>
                <ul>
                  <li>the User's violation of these Terms;</li>
                  <li>the User's use of the Website in violation of the law;</li>
                  <li>the User's actions that resulted in the violation of third parties' rights.</li>
                </ul>
              </section>

              <section className="legal-section">
                <h2>10. External Links and Third-Party Services</h2>
                <p>10.1. The Website may contain links to external Internet resources belonging to third parties. Such links are provided solely for the User's convenience.</p>
                <p>10.2. The Administration is not responsible for the content, privacy policy, terms of use, or actions of the owners of external Internet resources.</p>
                <p>10.3. The decision to go to external resources and use their services is made by the User independently and at their own risk.</p>
              </section>

              <section className="legal-section">
                <h2>11. Use of Cookies and Trackers</h2>
                <p>11.1. The Website uses cookies in accordance with the Privacy Policy available at <a href={`/${language}/privacy`}>Privacy Policy</a>.</p>
                <p>11.2. By using the Website, the User consents to the processing of cookies in accordance with these Terms and the Privacy Policy.</p>
                <p>11.3. Third-party web analytics services may be used to collect Website visit statistics and analyze usage. Detailed information about their operation principles and processed data is provided in the Privacy Policy.</p>
              </section>

              <section className="legal-section">
                <h2>12. Notices and Communication</h2>
                <p>12.1. All notices to the User are considered delivered from the moment they are posted on the Website.</p>
                <p>12.2. The User may contact the Administration through the feedback form on the Website at <a href={`/${language}/feedback`}>QSEN.RU/feedback</a>.</p>
                <p>12.3. The Administration agrees to review the User's request within 30 (thirty) calendar days from the date of receipt.</p>
              </section>

              <section className="legal-section">
                <h2>13. Non-Assignability</h2>
                <p>13.1. The User may not assign their rights and obligations under these Terms to third parties without the written consent of the Administration.</p>
                <p>13.2. The Administration may assign its rights and obligations under these Terms to any third party without the User's consent by notifying them through posting information on the Website.</p>
              </section>

              <section className="legal-section">
                <h2>14. Applicable Law and Dispute Resolution</h2>
                <p>14.1. These Terms are governed by and construed in accordance with the laws of the Russian Federation.</p>
                <p>14.2. All disputes arising from the relations governed by these Terms are resolved through negotiations. The response time to a claim is 30 (thirty) calendar days from the date of its receipt.</p>
                <p>14.3. If a dispute cannot be resolved through negotiations, it is referred to the court at the Administration's location in accordance with the procedural legislation of the Russian Federation.</p>
              </section>

              <section className="legal-section">
                <h2>15. Final Provisions</h2>
                <p>15.1. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions remain in full force and effect.</p>
                <p>15.2. The Administration's failure to exercise its rights under these Terms does not mean waiver of those rights.</p>
                <p>15.3. The Administration reserves all rights not expressly granted to the User under these Terms.</p>
                <p>15.4. All issues not regulated by these Terms are resolved in accordance with the legislation of the Russian Federation.</p>
              </section>

              <section className="legal-section">
                <h2>16. Administration Details</h2>
                <p>Website: QSEN.RU</p>
                <p>Contact email: <a href={`/${language}/feedback`}>feedback form on the website</a></p>
                <p className="legal-date">Publication date: April 24, 2026</p>
              </section>
            </>
          )}
        </div>
      </ToolPageShell>
    </>
  )
}

export default Terms