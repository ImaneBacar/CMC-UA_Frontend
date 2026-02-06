export default function Contact() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contactez-Nous
          </h1>
          <p className="text-xl text-orange-100">Nous sommes à votre écoute</p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Informations</h2>
            <div className="space-y-4">
              <p className="flex items-start gap-3">
                <span className="text-primary">📍</span>
                <span>Route de l'Aéroport, Moroni, Grande Comore</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-primary">📞</span>
                <span>+269 333 XX XX</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-accent">🚨</span>
                <span>Urgences: +269 777 XX XX</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-primary">✉️</span>
                <span>contact@clinique-alkamar.com</span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Formulaire</h2>
            <p className="text-gray-600">Formulaire de contact à venir...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
