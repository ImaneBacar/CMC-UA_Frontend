export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero temporaire */}
      <div className="bg-gradient-to-br from-primary to-primary-700 text-white">
        <div className="container-custom py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Clinique CMC-UA
            </h1>
            <p className="text-2xl md:text-3xl mb-8 text-primary-100">
              Excellence en Urologie et Analyses Médicales
            </p>
            <p className="text-lg mb-8 text-primary-50">
              Soins spécialisés de qualité avec équipements modernes et équipe
              expérimentée
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#services"
                className="btn bg-white text-primary hover:bg-primary-50"
              >
                Nos Services
              </a>
              <a
                href="/contact"
                className="btn bg-primary-600 text-white hover:bg-primary-700"
              >
                Prendre Rendez-vous
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section temporaire */}
      <div className="container-custom py-16">
        <h2 className="section-title text-center">Bienvenue sur notre site</h2>
        <p className="section-subtitle text-center mx-auto">
          Le portfolio est en construction. Navbar et Footer sont prêts !
        </p>
      </div>
    </div>
  );
}
