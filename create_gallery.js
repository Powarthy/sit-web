const fs = require('fs');
const path = require('path');

const dirs = ['gallerie', 'gallery', 'galleria'];
const basePath = path.join('/Users/paulbreton/Downloads/Arthur Final/SIte Web New Maquette/app/[locale]');

const content = `import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "../../../components/FadeIn";
import {
  Locale,
  getRouteAlternates,
  localizedRoutes,
  ogImageUrl,
  siteSettings
} from "../../../data/site-content";
import fs from "fs";
import path from "path";

export async function generateMetadata({
  params
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  return {
    title: "Galerie | The French Café",
    description: "Découvrez notre univers à travers notre galerie d'images.",
    alternates: {
      languages: getRouteAlternates("gallery")
    },
    openGraph: {
      title: "Galerie | The French Café",
      description: "Découvrez notre univers à travers notre galerie d'images.",
      siteNaconst fs = require('fs');
constpeconst path = require('pae:
const dirs = ['gallerie', ': [const basePath = path.join('/Users/paulbreton/Dot 
const content = `import type { Metadata } from "next";
import Image from "next/image";
import FadeIn frowd(import Image from "next/image";
import FadeIn from ".];import FadeIn from "../../../creimport {
  Locale,
  getRouteAlternates,
  locafi  Localil  getRou\.  localizedRoutes,
 bp  ogImageUrl,
  s    siteSettinle} from "../..s/import fs from "fs";
import path fr) import path from "p("
export async function ect  params
}or);
  }

  const titles: Recor}: {
  e, stri}): Promise<Metadata> {
  re    return {
    title: :     title"
  };

  const intros: Record<Locale, stri    alternates: {
      languages: getRouteAlternates("gallery"?tisserie fine et      languages:?c    },
    openGraph: {
      title: "Galerierl    ofi      title: "Gnd      description: "Découvrez notre univ k      siteNaconst fs = require('fs');
constpeconst path = require('pae:
const diiv className="bg-linen min-h-screen seleconst dirs = ['gallerie', ': [coteconst content = `import type { Metadata } from "next";
import Image from "next/lgimport Image from "next/image";
import FadeIn fiv classimport FadeIn frowd(import      import FadeIn from ".];import FadeIn from "../../. <  Locale,
  getRouteAlternates,
  locafi  Localil  getRoulassNam  getRouit  locafi  Localil  g   bp  ogImageUrl,
  s    siteSettinle} from "ld  s    siteSett         <p className="text-[0.65rem] uppercase tracking-export async function ect  params
}o  }or);
  }

  const titles: Rame}
   }
  
      e, stri}): Promise<Met/d  re    return {
    title: :me="    title: text-5  };

  const intros: presso t      languages: getRouteAlternates("gallery"?tiitles    openGraph: {
      title: "Galerierl    ofi      title: "Gnd      description: "Dt-      title: "Gd:constpeconst path = require('pae:
cot-4">
                {intros[params.locale]}
              </p>
            </div>
        const diiv className="bg-linen m <import Image from "next/lgimport Image from "next/image";
import FadeIn fiv classimport FadeIn frowd(import      import FadeIn from ".]m:import FadeIn fiv classimport FadeIn frowd(import      ip-  getRouteAlternates,
  locafi  Localil  getRoulassNam  getRouit  locafi  Localil  g   bp  ogImageUrl,
  s    siteSti  locafi  Localil  gx   s    siteSettinle} from "ld  s    siteSett         <p className="text-[0.65resp}o  }or);
  }

  const titles: Rame}
   }
  
      e, stri}): Promise<Met/d  re    return {
    title: :me="    title: text-5  };

  x   }

  c  
       }
  
      e, str0}  
         title: :me="    title: text-5  };

  consas
  const intros: presso t      languans      title: "Galerierl    ofi      title: "Gnd      description: "Dt-      title: "Gd:constidcot-4">
                {intros[params.locale]}
              </p>
            </div>
        const diiv className="bg-                        </p>
            </div>
>
            </divor        const diionimport FadeIn fiv classimport FadeIn frowd(import      import FadeIn from ".]m:import FadeIn fiv c{   locafi  Localil  getRoulassNam  getRouit  locafi  Localil  g   bp  ogImageUrl,
  s    sconsole.log('Gallery pages created');
