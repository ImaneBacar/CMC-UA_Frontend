export default function About() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            À Propos de la Clinique
          </h1>
          <p className="text-xl text-gray-300">Notre histoire et nos valeurs</p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Clinique CMC-UA</h2>
          <p className="text-gray-600 mb-4">
            La Clinique CMC-UA est un établissement de santé spécialisé en
            urologie et analyses médicales, situé à Moroni, Grande Comore.
          </p>
          <p className="text-gray-600 mb-4">
            Fondée avec la vision d'offrir des soins de qualité internationale
            aux Comores, nous combinons expertise médicale et équipements
            modernes pour le bien-être de nos patients.
          </p>
        </div>
      </div>
    </div>
  );
}
