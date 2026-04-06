export const faqItems = [
  {
    question: "Qu'est-ce que le spoofing email ?",
    answer:
      "Le spoofing email est une technique d'usurpation d'identit\u00e9 qui consiste \u00e0 envoyer un email en se faisant passer pour quelqu'un d'autre. L'attaquant falsifie l'adresse d'exp\u00e9diteur pour que le message semble provenir d'une source l\u00e9gitime, comme votre entreprise ou un coll\u00e8gue. C'est l'une des m\u00e9thodes les plus utilis\u00e9es dans les attaques de phishing.",
  },
  {
    question: "Comment savoir si mon domaine est vuln\u00e9rable ?",
    answer:
      "Utilisez notre outil gratuit : entrez simplement votre nom de domaine dans la barre de recherche ci-dessus. SpoofCheck analyse automatiquement vos enregistrements DNS (SPF, DKIM, DMARC, MTA-STS) et vous indique si votre domaine est prot\u00e9g\u00e9 contre l'usurpation d'identit\u00e9 email.",
  },
  {
    question: "Qu'est-ce que SPF, DKIM et DMARC ?",
    answer:
      "SPF (Sender Policy Framework) d\u00e9finit quels serveurs sont autoris\u00e9s \u00e0 envoyer des emails pour votre domaine. DKIM (DomainKeys Identified Mail) ajoute une signature cryptographique \u00e0 vos emails pour garantir leur int\u00e9grit\u00e9. DMARC (Domain-based Message Authentication, Reporting and Conformance) combine SPF et DKIM et d\u00e9finit la politique \u00e0 appliquer en cas d'\u00e9chec d'authentification.",
  },
  {
    question: "Comment corriger une vuln\u00e9rabilit\u00e9 email ?",
    answer:
      "Pour prot\u00e9ger votre domaine, vous devez configurer correctement trois enregistrements DNS : un enregistrement SPF qui liste vos serveurs d'envoi autoris\u00e9s, des cl\u00e9s DKIM pour la signature de vos emails, et une politique DMARC qui indique aux serveurs destinataires comment traiter les emails non authentifi\u00e9s.",
  },
  {
    question: "Est-ce que ce test est gratuit ?",
    answer:
      "Oui, SpoofCheck est 100% gratuit. Vous pouvez v\u00e9rifier autant de domaines que vous le souhaitez, sans inscription ni limite. Les v\u00e9rifications DNS sont publiques et non intrusives.",
  },
];
