import type { Locale } from "./site-content";

export type LegalPage = "privacy" | "terms";
type Document = { title: string; intro: string; sections: [string, string][] };

export const brunchTermsVersion = "2026-11-26";

export const bookingTermsLinkLabel = {
  fr: "Conditions de réservation et d’annulation",
  en: "Booking and cancellation terms",
  fi: "Varaus- ja peruutusehdot",
} satisfies Record<Locale, string>;

export const cancellationRule = {
  fr: "Vous pouvez annuler sans frais jusqu’à 24 heures avant le créneau réservé. En cas d’annulation moins de 24 heures avant ce créneau, le café peut demander une compensation pour les frais de préparation déjà engagés, dans la limite de 50 % du montant total des places annulées.",
  en: "You can cancel free of charge up to 24 hours before your booked sitting. If you cancel less than 24 hours before your booked sitting, the café may ask you to cover preparation costs already incurred, up to 50% of the total price of the cancelled places.",
  fi: "Voit peruuttaa varauksen maksutta viimeistään 24 tuntia ennen varattua kattausta. Jos peruutat varauksen alle 24 tuntia ennen varattua kattausta, kahvila voi periä korvauksen jo syntyneistä valmistelukuluista. Korvaus on enintään 50 % peruttujen paikkojen kokonaishinnasta.",
} satisfies Record<Locale, string>;

export const legalContent: Record<Locale, Record<LegalPage, Document>> = {
  fr: {
    privacy: {
      title: "Politique de confidentialité",
      intro: "Cette politique explique comment The French Café traite les données lorsque vous réservez, nous contactez ou utilisez le site.",
      sections: [
        ["Responsable du traitement", "The French Café Oy, numéro d’entreprise 3332543-4, Kitkantie 2, 93600 Kuusamo, Finlande."],
        ["Réservations et demandes", "Nous utilisons vos nom, e-mail, téléphone, créneau et nombre de personnes pour gérer votre réservation, vous contacter à son sujet et organiser le service. Ces données sont nécessaires pour traiter votre demande de réservation. Nous utilisons les informations que vous nous communiquez directement pour répondre à vos demandes."],
        ["Un problème avec un produit", "Si vous constatez un problème avec l’un de nos produits, contactez-nous dès que possible, idéalement dans les 24 heures suivant le constat, par e-mail ou par téléphone. Indiquez le nom du produit, la date d’achat et le problème rencontré. Nous utilisons ces informations pour examiner votre signalement et vous répondre. Un signalement plus tardif peut rendre le problème plus difficile à vérifier. Les droits légaux des consommateurs restent applicables."],
        ["Vérification de l’e-mail", "Nous vérifions que vous avez accès à l’adresse indiquée en vous envoyant un code via Resend. Le code expire après 10 minutes. Nous enregistrons la date d’acceptation et la version des conditions pour garder une preuve de votre accord."],
        ["Allergies", "Vous pouvez indiquer une allergie alimentaire et consentir explicitement à l’utilisation de cette information pour préparer votre accueil. Cette information est facultative. Évitez d’indiquer d’autres détails médicaux. Pour retirer votre consentement, contactez-nous."],
        ["Services utilisés", "Les réservations sont gérées avec ToqueHub et le site est hébergé par Netlify. Si vous acceptez les cookies de mesure d’audience, Google Analytics reçoit des données relatives à votre visite, telles que les pages consultées et les interactions avec le site. Google peut traiter des données en dehors de l’Espace économique européen."],
        ["Cookies et conservation", "Le site mémorise votre choix d’audience sur cet appareil pendant six mois. Vous pouvez le modifier via « Préférences de cookies » en bas de page. Les données de réservation et de contact sont conservées selon la durée nécessaire au traitement de votre demande et, le cas échéant, selon les obligations légales applicables."],
        ["Vos droits", "Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, leur portabilité ou la limitation du traitement dans les conditions applicables. Vous pouvez retirer votre consentement à tout moment et déposer une réclamation auprès du Bureau du médiateur finlandais pour la protection des données."],
      ],
    },
    terms: {
      title: "Conditions de réservation",
      intro: "Ces conditions concernent les réservations du brunch signature de The French Café Oy à Kuusamo.",
      sections: [
        ["Réserver", "Choisissez la date, le créneau et le nombre de personnes indiqués dans le formulaire. Vérifiez vos coordonnées et les informations de la réservation avant de confirmer. Le prix par personne est indiqué dans l’offre affichée avant confirmation."],
        ["Confirmation et liste d’attente", "Vérifiez le statut indiqué à la fin du parcours. Si vous choisissez de rejoindre la liste d’attente, votre place est confirmée uniquement lorsque le café vous indique qu’une table est disponible."],
        ["Modifier ou annuler", `${cancellationRule.fr} Pour modifier ou annuler votre réservation, utilisez le lien d’annulation s’il figure dans votre confirmation ou contactez le café en indiquant votre nom et votre créneau.`],
        ["Allergies et régimes alimentaires", "Vous pouvez nous signaler une allergie lors de la réservation. Contactez le café avant votre visite si vous souhaitez vérifier les possibilités d’adaptation du menu."],
      ],
    },
  },
  en: {
    privacy: {
      title: "Privacy policy",
      intro: "This policy explains how The French Café handles data when you book, contact us or use the website.",
      sections: [
        ["Data controller", "The French Café Oy, Business ID 3332543-4, Kitkantie 2, 93600 Kuusamo, Finland."],
        ["Bookings and enquiries", "We use your name, email address, phone number, chosen time and party size to manage your booking, contact you about it and organise the service. We need these details to process your booking request. We use information you provide directly to respond to your enquiries."],
        ["A problem with a product", "If you notice a problem with one of our products, please contact us by email or phone as soon as possible, ideally within 24 hours of noticing it. Include the product name, purchase date and a description of the issue. We use these details to investigate and respond. A later report may make the issue harder to verify. Your statutory consumer rights still apply."],
        ["Email verification", "We use Resend to send a code and verify that you can access the email address you provided. The code expires after 10 minutes. We record when you accepted the booking terms and which version you accepted."],
        ["Allergies", "You may tell us about a food allergy and explicitly consent to our using that information to prepare for your visit. This is optional. Please avoid including other medical details. Contact us to withdraw your consent."],
        ["Services we use", "We manage bookings with ToqueHub and host the site with Netlify. If you accept analytics cookies, Google Analytics receives information about your visit, such as the pages you viewed and your interactions with the site. Google may process data outside the European Economic Area."],
        ["Cookies and retention", "The site remembers your analytics choice on this device for six months. You can change it using ‘Cookie preferences’ at the bottom of the page. We retain booking and contact data as long as we need it to handle your request and for any period required by applicable law."],
        ["Your rights", "You may request access to, correction, erasure, portability or restriction of your data where applicable. You can withdraw consent at any time and lodge a complaint with Finland’s Office of the Data Protection Ombudsman."],
      ],
    },
    terms: {
      title: "Booking terms",
      intro: "These terms apply to signature brunch bookings with The French Café Oy in Kuusamo.",
      sections: [
        ["Making a booking", "Choose the date, sitting and party size in the booking form. Review your contact and booking details before confirming. The offer shows the price per person before confirmation."],
        ["Confirmation and waiting list", "Check the status at the end of the booking process. If you choose to join the waiting list, your place is confirmed once the café tells you a table is available."],
        ["Changes and cancellations", `${cancellationRule.en} To change or cancel a booking, use the cancellation link if it appears in your confirmation, or contact the café with your name and sitting time.`],
        ["Allergies and dietary needs", "You can tell us about a food allergy when booking. Contact the café before your visit to discuss possible adjustments to the menu."],
      ],
    },
  },
  fi: {
    privacy: {
      title: "Tietosuojaseloste",
      intro: "Tässä selosteessa kerromme, miten The French Café käsittelee tietojasi, kun varaat brunssin, otat meihin yhteyttä tai käytät verkkosivustoa.",
      sections: [
        ["Rekisterinpitäjä", "The French Café Oy, Y-tunnus 3332543-4, Kitkantie 2, 93600 Kuusamo, Suomi."],
        ["Varaukset ja yhteydenotot", "Käytämme nimeäsi, sähköpostiosoitettasi, puhelinnumeroasi, valitsemaasi kattausaikaa ja seurueen kokoa varauksen käsittelyyn, yhteydenpitoon ja palvelun järjestämiseen. Näitä tietoja tarvitaan varauspyynnön käsittelyyn. Käytämme meille antamiasi tietoja myös yhteydenottoihisi vastaamiseen."],
        ["Ongelma tuotteessa", "Jos huomaat tuotteessamme ongelman, ota meihin yhteyttä sähköpostitse tai puhelimitse mahdollisimman pian, mieluiten 24 tunnin kuluessa ongelman havaitsemisesta. Kerro tuotteen nimi, ostopäivä ja ongelman kuvaus. Käytämme näitä tietoja ilmoituksen selvittämiseen ja siihen vastaamiseen. Myöhemmin tehty ilmoitus voi vaikeuttaa ongelman selvittämistä. Lakisääteiset kuluttajanoikeutesi pysyvät voimassa."],
        ["Sähköpostiosoitteen vahvistaminen", "Lähetämme Resend-palvelun kautta koodin varmistaaksemme, että ilmoittamasi sähköpostiosoite on käytössäsi. Koodi vanhenee 10 minuutissa. Tallennamme varausehtojen hyväksymisajankohdan ja hyväksytyn version."],
        ["Allergiat", "Voit ilmoittaa ruoka-allergiasta ja antaa nimenomaisen suostumuksesi tiedon käyttöön vierailusi valmistelussa. Tieto on vapaaehtoinen. Älä ilmoita muita terveystietoja. Voit peruuttaa suostumuksesi ottamalla meihin yhteyttä."],
        ["Käyttämämme palvelut", "Käsittelemme varaukset ToqueHubissa, ja sivustoa ylläpidetään Netlifyssä. Jos hyväksyt analytiikkaevästeet, Google Analytics saa tietoja vierailustasi, kuten katsomasi sivut ja toimintasi sivustolla. Google voi käsitellä tietoja Euroopan talousalueen ulkopuolella."],
        ["Evästeet ja säilytys", "Sivusto muistaa analytiikkavalintasi tällä laitteella kuusi kuukautta. Voit muuttaa valintaasi sivun alareunan Evästeasetukset-painikkeella. Säilytämme varaus- ja yhteystietoja niin kauan kuin pyyntösi hoitaminen tai sovellettava laki sitä edellyttää."],
        ["Oikeutesi", "Voit soveltuvin osin pyytää pääsyä tietoihisi, tietojen oikaisua, poistamista, siirtämistä tai käsittelyn rajoittamista. Voit peruuttaa suostumuksesi milloin tahansa ja tehdä valituksen tietosuojavaltuutetun toimistolle."],
      ],
    },
    terms: {
      title: "Varausehdot",
      intro: "Nämä ehdot koskevat The French Café Oy:n signature-brunssin varauksia Kuusamossa.",
      sections: [
        ["Varaaminen", "Valitse lomakkeella päivämäärä, kattausaika ja seurueen koko. Tarkista yhteys- ja varaustiedot ennen vahvistamista. Tarjouksessa näkyy hinta henkilöä kohden ennen vahvistamista."],
        ["Vahvistus ja jonotuslista", "Tarkista varauksen tila varausprosessin lopussa. Jos liityt jonotuslistalle, paikkasi vahvistuu, kun kahvila ilmoittaa pöydän vapautumisesta."],
        ["Muutokset ja peruutukset", `${cancellationRule.fi} Jos haluat muuttaa tai peruuttaa varauksen, käytä vahvistuksessa olevaa peruutuslinkkiä, jos sellainen on annettu. Voit myös ottaa yhteyttä kahvilaan ja ilmoittaa nimesi ja kattausaikasi.`],
        ["Allergiat ja ruokavaliot", "Voit ilmoittaa ruoka-allergiasta varauksen yhteydessä. Ota yhteyttä kahvilaan ennen vierailua, jos haluat selvittää, voidaanko menua mukauttaa."],
      ],
    },
  },
};

export const allergyConsent = {
  fr: "J’accepte que le café utilise les informations sur mes allergies pour préparer ma visite.",
  en: "I agree that the café may use my allergy information to prepare for my visit.",
  fi: "Annan suostumukseni allergiatietojeni käyttöön vierailuni valmistelussa.",
} satisfies Record<Locale, string>;
