import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Lara from '@primeng/themes/lara';
import {definePreset} from '@primeng/themes';
import {provideHttpClient} from '@angular/common/http';
import {provideFormlyCore} from '@ngx-formly/core';
import {withFormlyPrimeNG} from '@ngx-formly/primeng';
import {FormlyDatepickerModule} from '@ngx-formly/primeng/datepicker';
import {
  PanelFieldWrapperComponent
} from './features/dynform/components/panel-field-wrapper/panel-field-wrapper.component';

// Définir un preset personnalisé en étendant Lara
const CustomPreset = definePreset(Lara, {
  // Définir des couleurs primitives personnalisées
  primitive: {
    customPrimary: {
      500: '#FF5733', // Remplacez par la couleur hexadécimale souhaitée
    },
  },
  // Mapper les couleurs sémantiques sur les couleurs primitives
  semantic: {
    primary: {
      50: '{gray.50}',
      100: '{gray.100}',
      200: '{gray.200}',
      300: '{gray.300}',
      400: '{gray.400}',
      500: '{gray.500}',
      600: '{gray.600}',
      700: '{gray.700}',
      800: '{gray.800}',
      900: '{gray.900}',
      950: '{gray.950}'
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: CustomPreset,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      }
    }),
    // ✅ Formly configuration
    provideFormlyCore([
      ...withFormlyPrimeNG(),
      {
        validationMessages: [
          { name: 'required', message: 'This field is required' },
        ],
        wrappers:[
          { name: 'panel',component: PanelFieldWrapperComponent},
        ]
      },
    ]),
  ]
};
