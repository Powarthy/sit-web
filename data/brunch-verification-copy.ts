import type { Locale } from "./site-content";

const copy = {
  fr: {
    send: "Envoyer le code", resend: "Renvoyer le code", sending: "Envoi du code…",
    prompt: "Envoyez un code à l’adresse indiquée pour vérifier votre e-mail.",
    sent: "Saisissez le code à six chiffres envoyé à cette adresse. Il expire après 10 minutes.",
    field: "Code de vérification", demo: "Code de démonstration",
    accept: "J’accepte les conditions de réservation.", readTerms: "Lire les conditions", sendError: "Impossible d’envoyer le code. Vérifiez votre adresse et réessayez.",
    wait: "Patientez une minute avant de demander un autre code.",
    invalid: "Le code est incorrect ou a expiré. Vérifiez-le ou demandez un nouveau code.",
  },
  en: {
    send: "Send code", resend: "Resend code", sending: "Sending code…",
    prompt: "Send a code to this address to verify your email.",
    sent: "Enter the six-digit code sent to this address. It expires after 10 minutes.",
    field: "Verification code", demo: "Preview code",
    accept: "I accept the booking terms.", readTerms: "Read the terms", sendError: "We couldn’t send the code. Check your email address and try again.",
    wait: "Wait one minute before requesting another code.",
    invalid: "The code is incorrect or expired. Check it or request a new code.",
  },
  fi: {
    send: "Lähetä koodi", resend: "Lähetä koodi uudelleen", sending: "Lähetetään koodia…",
    prompt: "Vahvista sähköpostiosoitteesi lähettämällä siihen koodi.",
    sent: "Syötä osoitteeseen lähetetty kuusinumeroinen koodi. Koodi vanhenee 10 minuutissa.",
    field: "Vahvistuskoodi", demo: "Esikatselukoodi",
    accept: "Hyväksyn varausehdot.", readTerms: "Lue varausehdot", sendError: "Koodia ei voitu lähettää. Tarkista sähköpostiosoitteesi ja yritä uudelleen.",
    wait: "Odota minuutti ennen uuden koodin pyytämistä.",
    invalid: "Koodi on virheellinen tai vanhentunut. Tarkista koodi tai pyydä uusi.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default copy;
