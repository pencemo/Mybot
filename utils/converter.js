
import { maps } from './maps.js';
// const {maps} =require('./maps.js');

export default (unicodeText) => {
   var letters = Object.keys(maps)
   var index = 0;
   var asciiText = '';
   var i = 3;
   var letter = '', asciiLetter = '';
   var priorMatchLetter = null;
   var tya = '്യ', tra = '്ര';
   tya = maps[tya];
   tra = maps[tra];
   var letterArray = [];

   while (index < unicodeText.length) {
      for (i = 3; i >= 1; i--) {
         letter = unicodeText.substring(index, index + i);
         if (letters.indexOf(letter) !== -1) {
            asciiLetter = maps[letter];
            if (letter === 'ൈ') {
               asciiText = asciiText.substring(0, asciiText.length - 1) + asciiLetter + asciiText[asciiText.length - 1];
               letterArray.splice(letterArray.length - 1, 0, {
                  type: 'M',
                  chunk: asciiLetter
               });
            } else if (letter === 'ോ' || letter === 'ൊ' || letter === 'ൌ') {
               if (asciiText.substring(asciiText.length - 2, asciiText.length - 1) === tra) {
                  asciiText = asciiText.substring(0, asciiText.length - 2) + asciiLetter[0] + asciiText.substring(asciiText.length - 2) + asciiLetter[1];
                  letterArray.splice(letterArray.length - 2, 0, {
                     type: 'M',
                     chunk: asciiLetter[0]
                  });
                  letterArray.push({
                     type: 'M',
                     chunk: asciiLetter[1]
                  });
               } else {
                  asciiText = asciiText.substring(0, asciiText.length - 1) + asciiLetter[0] + asciiText[asciiText.length - 1] + asciiLetter[1];
                  letterArray.splice(letterArray.length - 1, 0, {
                     type: 'M',
                     chunk: asciiLetter[0]
                  });
                  letterArray.push({
                     type: 'M',
                     chunk: asciiLetter[1]
                  });
               }
            } else if (letter === 'െ' || letter === 'േ' || letter === '്ര') {
               if (asciiText.substring(asciiText.length - 2, asciiText.length - 1) === tra) {
                  asciiText = asciiText.substring(0, asciiText.length - 1) + asciiLetter + asciiText.substring(asciiText.length - 1);
                  letterArray.splice(letterArray.length - 2, 0, {
                     type: 'M',
                     chunk: asciiLetter
                  });
               } else {
                  asciiText = asciiText.substring(0, asciiText.length - 1) + asciiLetter + asciiText[asciiText.length - 1];
                  letterArray.splice(letterArray.length - 1, 0, {
                     type: 'M',
                     chunk: asciiLetter
                  });
               }

            } else {
               asciiText = asciiText + asciiLetter;
               letterArray.push({
                  type: 'M',
                  chunk: asciiLetter
               });
            }
            priorMatchLetter = letter;
            index = index + i;
            break;
         } else {
            if (i === 1) {
               index = index + 1;
               asciiText = asciiText + letter;
               letterArray.push({
                  type: 'E',
                  chunk: letter
               });
               break;
            }
            asciiLetter = letter;
         }
      }
   }

   return letterArray;
}
