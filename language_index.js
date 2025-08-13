const français = {
    nrm: {
        "paramsTitle": "<b>Paramètres</b>",
        "lanTemplate": "Modèle",
        "lanNone": "Aucun",
        //"lanNone2": "Aucun",
        "lanFormatting" : "Formattage de texte",
        "noteClippy": "Texte copié dans le presse-papier",
        "lanqList0": "Puce •",
        "lanqList1": "Puce « »",
        "lanqList2": 'Puce ""',
    },
    label: {
        "lnBgn": "Balise de début :",
        "lnEnd": "Balise de fin :",
        "hltColor": "Couleur de surlignage : {{color|_____|",
        "insTtl": "Titres",
        //"insBtn": "Icônes",
        "insBrk": "Sauts de fin de ligne",
        "insBrkIN": "Sauts de lignes internes",
        //"btnLabel": "Modèle d'icône :",
    },
    placeholder: {
        "inputDia":
            `Coller le texte à formatter ici\n"009": "C'est [color=0001]Papi[color=ffff] qu'on cherche, pas un trésor. Et je pense\npas que Numéro 3 ait besoin d'un Ayo-mètre. Bref..."`,

        "outputDia":
            `Le texte formatté s'affichera ici. Il suffira de cliquer ici pour copier le texte. \n*« C'est {{color|Papi|orange}} qu'on cherche, pas un trésor. Et je pense pas que Numéro 3 ait besoin d'un Ayo-mètre. Bref... »`
    }
}
const english = {
    nrm: {
        "paramsTitle": "<b>Parameters</b>",
        "lanTemplate": "Template",
        "lanNone": "None",
        //"lanNone2": "None",
        "lanFormatting" : "Text formatting",
        "noteClippy": "Copied text in the clipboard",
        "lanqList0": "List • ",
        "lanqList1": "Tags « »",
        "lanqList2": 'Tags ""',
    },
    label: {
        "lnBgn": "Beginning tag :",
        "lnEnd": "Ending tag :",
        "hltColor": "Highlighting color: {{color|_____|",
        "insTtl": "Titles",
        //"insBtn": "Icons",
        "insBrk": "End of line breaks",
        "insBrkIN": "Internal line breaks",
        //"btnLabel": "Icon template:",
    },
    placeholder: {
        "inputDia":
            `Paste raw JSON here\n"009": "C'est [color=0001]Papi[color=ffff] qu'on cherche, pas un trésor. Et je pense\\npas que Numéro 3 ait besoin d'un Ayo-mètre. Bref...",`,

        "outputDia":
            `Formatted text will be here. Click here to copy the text. \n*« C'est {{color|Papi|orange}} qu'on cherche, pas un trésor. Et je pense pas que Numéro 3 ait besoin d'un Ayo-mètre. Bref... »`
    }
}

export {français, english};