import { createTheme } from '@uiw/codemirror-themes';

import { tags as t } from '@lezer/highlight';

export const viewTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#0c1021', // Azul
    foreground: '#61ce3c', // Amarillo
    caret: '#a7a7a7', // Gris
    selection: '#253b76', // Azul oscuro
    selectionMatch: 'transparent',
    gutterBackground: '#0c1021',
    gutterForeground: '#78887a', // Gris transparente para los elementos
    gutterBorder: 'red',
    gutterActiveForeground: '#838A84', // Gris transparente para los elementos
    lineHighlight: 'transparent', // Linea seleccionada
    fontFamily: 'inherit',
  },
  styles: [
    { tag: t.comment, color: '#61ce3c' }, // Color gris de comentarios
    { tag: t.definition(t.typeName), color: '#61ce3c' },
    { tag: t.variableName, color: '#61ce3c' }, // Naranja
    { tag: t.string, color: '#61ce3c' }, // Verde
    { tag: t.number, color: '#fbde2d' }, //Amarillo
    { tag: t.function(t.variableName), color: '#61ce3c' }, // Azul 8da6ce
    { tag: t.propertyName, color: '#61ce3c' }, // Blanco
    { tag: t.bracket, color: '#FFF' }, // Blanco
    { tag: t.squareBracket, color: '#FFF' }, // Blanco
    { tag: t.definition(t.variableName), color: '#61ce3c' },
    { tag: t.separator, color: '#FFF' }, // Blanco
    { tag: t.derefOperator, color: '#FFF' }, // Blanco
    { tag: t.null, color: '#d8fa3c' }, // Amarillo lima
  ],
});