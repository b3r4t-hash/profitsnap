import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-lg">ProfitSnap</span>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">
            Connexion
          </Link>
          <Link
            href="/register"
            className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Essai gratuit
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-2xl text-balance">
          Est-ce que ce produit va te faire gagner de l&apos;argent ?
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-xl text-balance">
          Calcule ta marge réelle sur eBay en 30 secondes — frais inclus, sans Excel, sans prise de tête.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-green-700 transition-colors"
          >
            Calculer gratuitement
          </Link>
          <Link
            href="#pricing"
            className="bg-white text-gray-700 border px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Voir les tarifs
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-400">3 calculs gratuits par jour · Sans carte bancaire</p>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white border-t">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Simple et transparent</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free */}
            <div className="border rounded-2xl p-8 text-left">
              <p className="font-semibold text-lg">Gratuit</p>
              <p className="mt-2 text-4xl font-bold">0€</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li>✓ 3 calculs par jour</li>
                <li>✓ Résultat instantané</li>
                <li>✗ Historique</li>
                <li>✗ Export CSV</li>
              </ul>
              <Link href="/register" className="mt-8 block text-center border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Commencer
              </Link>
            </div>
            {/* Pro */}
            <div className="border-2 border-green-600 rounded-2xl p-8 text-left relative">
              <span className="absolute -top-3 left-6 bg-green-600 text-white text-xs px-3 py-1 rounded-full">Populaire</span>
              <p className="font-semibold text-lg">Pro</p>
              <p className="mt-2 text-4xl font-bold">19€<span className="text-lg font-normal text-gray-500">/mois</span></p>
              <ul className="mt-6 space-y-3 text-sm text-gray-600">
                <li>✓ Calculs illimités</li>
                <li>✓ Résultat instantané</li>
                <li>✓ Historique complet</li>
                <li>✓ Export CSV</li>
              </ul>
              <Link href="/register?plan=pro" className="mt-8 block text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                Démarrer Pro
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
