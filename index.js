import { français, english } from "./language_index.js";

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}


const regSearch = {
  // group=0001=vide? voir avec les autres langues // 0002=Stat num dynamique // 0003=Icônes // 0004=Icônes et boutons
  reGroupAll: /\[\/?group=.*?\]/gm,
  reGroup034: /\[group=000(3|4).*?\]/gm,
  reColor0: /\[color=00.{2}\]/gm,        //balise ouverture
  reColor1: /\[color=.*?\]/gm,           //balise fermeture
};
const qType = { //Template/Modèle presets
  qQuote: ['{{Quote|', '|$AUTEUR<ref></ref>}}'],
  qList0: ['* ', ''],
  qList1: ['* « ', ' »'],
  qList2: ['* "', '"'],
  qJudd: ['{{JuddAdvice|', '}}'],
  qNone: ['', ''],
  qMissionQuote: ['{{Mission quote|RotM|Callie|', '}}'],
  qAmiiboQuote: ['{{Amiibo quote|', '|$ACTION}}', '|translation='],
};
const insBrk = ['', '<br>'];
const insBtn = {
  button: "{{Button|$SYMBOLE|Switch}}",
  cost: "{{Cost|S3|$CURRENCY}}",
};

const arrVals = Array.from(document.getElementsByClassName('inputVal'))
const arrChecks = Array.from(document.getElementsByClassName('inputCheck'))
const inputDia = document.getElementById("inputDia")
const outputDia = document.getElementById("outputDia")
let inputObj = {} // "elementID": node

for (let element of arrVals) {
  inputObj[element.id] = element
};
for (let element of arrChecks) {
  inputObj[element.id] = element
};
console.log(inputObj)

//style //taille des inputs text
function entrySizeUp(event) {
  if (event.target.value.length > event.target.size) {
    event.target.style.width = String((event.target.value.length + 1) * 1.2) + "ch"
  } else {event.target.style.width = ""}
}

//Radio templates
function unselect(radioname) {
  document.getElementsByName(radioname)[0].checked = true;
  document.getElementsByName(radioname)[0].checked = false;
}

const once = {
  once: true,
};

function updateTemplate(event) {
  inputObj.lnBgn.value = qType[event.target.id][0];
  inputObj.lnEnd.value = qType[event.target.id][1];
  updateTxt();
  inputObj.lnBgn.addEventListener('keydown', function templateCancel(){unselect("qType")}, once);
  inputObj.lnEnd.addEventListener('keydown', function templateCancel(){unselect("qType")}, once);
};

function toggleDisplay(event, idTarget) {
  if (event.target.checked == false) {
    document.getElementById(idTarget).style.display = "none";
  } else {
    document.getElementById(idTarget).style.display = "block";
  }
}

function updateTxt() {
  let srcDialog = inputDia.value;
  // formattage avant conversion str en json
  srcDialog = srcDialog.trimEnd();
  if (srcDialog.charAt(srcDialog.length - 1) == ',') {
    srcDialog = srcDialog.slice(0, srcDialog.length - 1);
  };
  if (srcDialog.match(/\[/g) != null) {
    //checks for equal numbers of [ and ], in case of an unclosed array
    if (srcDialog.match(/\]/g) === null || srcDialog.match(/\[/g).length !== srcDialog.match(/\]/g).length) {
      srcDialog += "]"
    };
  };
  if (inputObj.insBrkIN.checked === true) {
    srcDialog = srcDialog.replace(/\\n/g, "<br>");
    srcDialog = srcDialog.replace(/\[page break\]/g, "<br>");
  } else {
    srcDialog = srcDialog.replace(/\\n/g, " ");
    srcDialog = srcDialog.replace(/\[page break\]/g, " ");
  };
  srcDialog = srcDialog.replace(/\S*\s*\{|}/g, "");
  srcDialog = '{' + srcDialog + '}';
  console.log('json format :' + srcDialog);

  try {srcDialog = JSON.parse(srcDialog);}
  catch (err){outputDia.value = "Invalid format"; console.log(err); return}

  //creation str sortie ligne par ligne
  let newDialog = "";
  if (inputObj.insTtl.checked === true) {
    for (let x in srcDialog) {
      newDialog = newDialog + x + " :\n";
      newDialog = newDialog + inputObj.lnBgn.value + srcDialog[x] + inputObj.lnEnd.value + insBrk[inputObj.insBrk.checked ? 1 : 0] + "\n";
    }
  } else {
    for (let x in srcDialog) {
      newDialog = newDialog + inputObj.lnBgn.value + srcDialog[x] + inputObj.lnEnd.value + insBrk[inputObj.insBrk.checked ? 1 : 0] + "\n";
    }
  }
  //remplace toutes balises de couleurs, et de "group" qui sont des boutons ou symboles
  newDialog = newDialog.replace(regSearch.reColor0, '{{color|');
  newDialog = newDialog.replace(regSearch.reColor1, '|' + inputObj.hltColor.value + '}}');

  try {
    let S3Match = Array.from(newDialog.match(regSearch.reGroup034));
    let index = 0;
    console.log(typeof (S3Match))
    while (index < S3Match.length) {
      console.log(S3Match[index])
      try {
        newDialog = newDialog.replace(S3Match[index], "{{Button|" + getKeyByValue(S3buttons, S3Match[index]).slice(0, -1) + "|switch}}");
      }
      catch {
        if (typeof (getKeyByValue(S3Other, S3Match[index])) === 'string') {
          newDialog = newDialog.replace(S3Match[index], getKeyByValue(S3Other, S3Match[index]));
        } else {
          newDialog = newDialog.replace(S3Match[index], "{{$SYMBOL}}");
        }
      }
      index++;
    }
    newDialog = newDialog.replace(regSearch.reGroupAll, '');
  } catch {}


  outputDia.value = newDialog;

  //document.getElementById("preview").innerHTML = newDialog ;
}
//page made by popamolamola aka mioumi :3
//section insertion dans presse-papier
async function clippy() {
  const lGrey = "rgba(230,230,230,"
  if (outputDia.value !== '') {
    navigator.clipboard.writeText(outputDia.value);
    outputDia.style.background = lGrey + "1)";
    document.getElementById("noteClippy").style.display = 'inline';
    let y = 5;
    while (y != 0) {
      y--
      outputDia.style.background = lGrey + y / 5 + ")";
      await sleep(50);
    }
    outputDia.style.background = lGrey + "0)"; //shhhh its bad animation ikik
    await sleep(1500);
    document.getElementById("noteClippy").style.display = 'none';
  }
}

//language
function langSwitchLoad() {
  if (navigator.language.startsWith("fr") === true) {
    return
  } else { langSwitch(english) }
}
function langSwitch(language) {
  for (let IDkeys in language.nrm) {
    try {
      document.getElementById(IDkeys).innerHTML = language.nrm[IDkeys]
    } catch { }
  };

  for (let labelHTML of document.querySelectorAll('.params label')) {
    try {
      labelHTML.innerHTML = language.label[labelHTML.htmlFor]
    } catch { }
  };

  for (let IDkeys in language.placeholder) {
    document.getElementById(IDkeys).placeholder = language.placeholder[IDkeys]
  };

  if (language === français) {
    document.getElementById("langSW").style.left = "4px"
  } else if (language === english) {
    document.getElementById("langSW").style.left = "38px"
  }
}

////eventlisteners i guess
document.addEventListener("load", function loader(event){
  updateTxt();
  langSwitchLoad();
  //toggleDisplay(event, "insBtnDetail");
});

document.getElementById("langFR").addEventListener("click", () => { langSwitch(français) });
document.getElementById("langEN").addEventListener("click", () => { langSwitch(english) });

//document.getElementById("insBtn").addEventListener("change", function(event){toggleDisplay(event, "insBtnDetail")});

inputDia.addEventListener("paste", updateTxt)
inputDia.addEventListener("change", updateTxt)
outputDia.addEventListener("click", clippy)


arrVals.forEach(element => {
  element.addEventListener("keyup", entrySizeUp)
  element.addEventListener("keyup", updateTxt)
})
arrChecks.forEach(element => {
  element.addEventListener("change", updateTxt)
})

//radio templates
document.querySelectorAll('#Qtypes input[type="radio"]').forEach(element => {
  element.addEventListener("click", function(event){updateTemplate(event)})
})

console.log("%cAttention l'ami !\nSi on te demande des informations depuis cette fenêtre, n'y prête pas attention!\n", "font-size:2em;color:DarkBlue",
  "\nQui sait ce que les hackers peuvent faire en possession de tes informations...\n")
console.log("%cÀ moins que tu sais exactement ce que tu écris ici, fais demi-tour.\n", "font-size:1.6em")
console.log("%cWatch out, buddy!\nIf someone asks you info from this window, ignore them!\n", "font-size:2em;color:DarkBlue",
  "Who knows what hackers can do if they get your info...\n")
console.log("%cUnless you exactly what you're wrinting here, please turn around.\n", "font-size:1.6em")

const S3buttons = { //PictFontRef
  "A0": "[group=0003 type=0000 params=52 b8 5e 3f 03 00 00 00]",
  "B0": "[group=0003 type=0001 params=52 b8 5e 3f 03 00 00 00]",
  "X0": "[group=0003 type=0002 params=52 b8 5e 3f 03 00 00 00]",
  "Y0": "[group=0003 type=0003 params=52 b8 5e 3f 03 00 00 00]",
  "Dpad0": "[group=0003 type=0004 params=52 b8 5e 3f 03 00 00 00]",
  "DpadUp0": "[group=0003 type=000e params=52 b8 5e 3f 03 00 00 00]",
  "L0": "[group=0003 type=0009 params=52 b8 5e 3f 03 00 00 00]",
  "R0": "[group=0003 type=000a params=52 b8 5e 3f 03 00 00 00]",
  "ZL0": "[group=0003 type=000b params=52 b8 5e 3f 03 00 00 00]",
  "ZR0": "[group=0003 type=000c params=52 b8 5e 3f 03 00 00 00]",
  "LStick0": "[group=0003 type=0007 params=1f 85 2b 3f 00 00 00 00]",
  "RStick0": "[group=0003 type=0008 params=1f 85 2b 3f 00 00 00 00]",
  "Minus0": "[group=0003 type=0006 params=52 b8 5e 3f 03 00 00 00]",
  "Plus0": "[group=0003 type=0005 params=52 b8 5e 3f 03 00 00 00]",
  "B1": "[group=0003 type=0047 params=00 00 80 3f 00 00 00 00]",
  "X1": "[group=0003 type=0002 params=00 00 80 3f 00 00 00 00]",
  "LStick1": "[group=0003 type=004b params=48 e1 3a 3f fe ff ff ff]",
  "RStick1": "[group=0003 type=004c params=00 00 00 40 00 00 00 00]",
  "R1": "[group=0003 type=004e params=00 00 80 3f 00 00 00 00]",
  "ZL1": "[group=0003 type=004f params=00 00 80 3f 00 00 00 00]",
  "ZR1": "[group=0003 type=0050 params=00 00 80 3f 00 00 00 00]",
  "Plus1": "[group=0003 type=004a params=00 00 80 3f 00 00 00 00]",
  "A2": "[group=0003 type=0046 params=00 00 80 3f 00 00 00 00]",
  "X2": "[group=0003 type=0048 params=00 00 80 3f 00 00 00 00]",
  "Y2": "[group=0003 type=0049 params=00 00 80 3f 00 00 00 00]",
  "LStick2": "[group=0003 type=004b params=ec 51 38 3f fe ff ff ff]",
  "RStick2": "[group=0003 type=004c params=ec 51 38 3f fe ff ff ff]",
  "Plus2": "[group=0003 type=004a params=00 00 80 3f 00 00 00 00]",
  "Minus2": "[group=0003 type=0052 params=00 00 80 3f 00 00 00 00]",
  "A3": "[group=0003 type=0000 params=00 00 80 3f 00 00 00 00]",
  "B3": "[group=0003 type=0001 params=00 00 80 3f 00 00 00 00]",
  "R3": "[group=0003 type=000a params=00 00 80 3f 00 00 00 00]",
  "ZL3": "[group=0003 type=000b params=00 00 80 3f 00 00 00 00]",
  "ZR3": "[group=0003 type=000c params=00 00 80 3f 00 00 00 00]",
  "Y4": "[group=0003 type=0003 params=00 00 80 3f 00 00 00 00]",
  "LStick4": "[group=0003 type=0007 params=7b 14 2e 3f 00 00 00 00]",
  "Minus4": "[group=0003 type=0006 params=00 00 80 3f 00 00 00 00]",
  "Plus4": "[group=0003 type=0005 params=00 00 80 3f 00 00 00 00]",
  "Dpad5": "[group=0003 type=0004 params=00 00 80 3f 00 00 00 00]",
  "DpadDown5": "[group=0003 type=0028 params=29 5c 4f 3f 00 00 00 00]",
  "DpadUp5": "[group=0003 type=000e params=29 5c 4f 3f 00 00 00 00]",
  "LStick5": "[group=0003 type=0007 params=cd cc 4c 3f 00 00 00 00]",
  "RStick5": "[group=0003 type=0008 params=cd cc 4c 3f 00 00 00 00]",
  "A6": "[group=0003 type=0000 params=29 5c 0f 40 05 00 00 00]",
  "B6": "[group=0003 type=0001 params=29 5c 0f 40 05 00 00 00]",
  "Dpad6": "[group=0003 type=0004 params=29 5c 0f 40 05 00 00 00]",
  "DpadDown6": "[group=0003 type=0028 params=29 5c 0f 40 05 00 00 00]",
  "DpadUp6": "[group=0003 type=000e params=29 5c 0f 40 05 00 00 00]",
  "L6": "[group=0003 type=0009 params=29 5c 0f 40 05 00 00 00]",
  "LStick6": "[group=0003 type=0007 params=5c 8f c2 3f 05 00 00 00]",
  "R6": "[group=0003 type=000a params=29 5c 0f 40 05 00 00 00]",
  "RStick6": "[group=0003 type=0008 params=5c 8f c2 3f 05 00 00 00]",
  "X6": "[group=0003 type=0002 params=29 5c 0f 40 05 00 00 00]",
  "Y6": "[group=0003 type=0003 params=29 5c 0f 40 05 00 00 00]",
  "ZL6": "[group=0003 type=000b params=29 5c 0f 40 05 00 00 00]",
  "ZR6": "[group=0003 type=000c params=29 5c 0f 40 05 00 00 00]",
  "X7": "[group=0003 type=0048 params=00 00 80 3f fe ff ff ff]",
  "B7": "[group=0003 type=0001 params=00 00 20 40 00 00 00 00]",
  "LStick7": "[group=0003 type=0007 params=00 00 20 40 00 00 00 00]",
  "R7": "[group=0003 type=000a params=00 00 20 40 00 00 00 00]",
  "RStick7": "[group=0003 type=0008 params=00 00 20 40 00 00 00 00]",
  "Y7": "[group=0003 type=0003 params=00 00 20 40 00 00 00 00]",
  "ZL7": "[group=0003 type=000b params=00 00 20 40 00 00 00 00]",
  "ZR7": "[group=0003 type=000c params=00 00 20 40 00 00 00 00]",
}
const S3Other = {
  "{{Cost|S2||sard}}": "[group=0003 type=001f params=00 00 80 3f 00 00 00 00]",
  "{{Cost|S2||ge}}": "[group=0003 type=0051 params=00 00 80 3f 00 00 00 00]",
  "{{Icon|S3|Key}}": "[group=0003 type=001a params=00 00 80 3f 00 00 00 00]",
  "{{Icon|S3|Upgrade Point}}": "[group=0003 type=0020 params=00 00 80 3f 00 00 00 00]",
  "{{Cost|S3||pe}}": "[group=0003 type=0017 params=00 00 80 3f 00 00 00 00]",
  "{{Cost|S3||sl}}": "[group=0003 type=001c params=29 5c 4f 3f 00 00 00 00]",
  "{{Cost|S3||gsl}}": "[group=0003 type=001d params=f6 28 5c 3f 00 00 00 00]",
  "[[File:Shell-Out Token.png|24px]]": "[group=0003 type=0022 params=e1 7a 94 3f 00 00 00 00]",
  "{{Cost|S3||cash}}": "[group=0003 type=0027 params=85 eb 91 3f 00 00 00 00]",
  "{{Cost|S3||mb}}": "[group=0003 type=003f params=00 00 80 3f 00 00 00 00]",
  "{{Cost|S3||pl}}": "[group=0003 type=0040 params=00 00 80 3f 00 00 00 00]",
}
