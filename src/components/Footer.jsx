import { Phone, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4 float-animation">
              <div className="text-xl font-bold">Bizantino</div>
              <div className="text-xs font-semibold text-purple-400">BOUTIQUE</div>
            </div>
            <p className="text-slate-400">Tu boutique de moda en Soacha.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-purple-400">Locales</h4>
            <ul className="space-y-2 text-slate-400 text-sm hover-items">
              <li className="hover:text-purple-400 transition cursor-pointer hover:translate-x-2 transition-transform">Carrera 7ma # 15 - 18</li>
              <li className="hover:text-purple-400 transition cursor-pointer hover:translate-x-2 transition-transform">CC Soacha Plaza Local 108</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-purple-400">Contacto</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2 hover:text-purple-400 transition cursor-pointer hover:translate-x-2 transition-transform">
                <Phone className="w-4 h-4" />
                3214141192
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-purple-400">Síguenos</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a 
                  href="https://www.instagram.com/bizantino_boutique?igsh=cjVhZTZvYnVhZWxu" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-purple-400 transition flex items-center gap-2 hover:translate-x-2 transition-transform"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; 2024 Bizantino Boutique. Todos los derechos reservados. ✨</p>
        </div>
      </div>
    </footer>
  );
}
