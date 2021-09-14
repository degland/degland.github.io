miro.onReady(() => {
    // subscribe on user selected widgets
    miro.addListener(miro.enums.event.SELECTION_UPDATED, generateList)
    generateList()
})

// Get html elements for tip and text container
const tipElement = document.getElementById('tip')
const widgetTextElement = document.getElementById('widget-text')

const version = 29

async function generateList() {
    //Get all the widgets
    let widgets = await miro.board.widgets.get()

    //Throw away widgets that aren't stickers (post-its)
    widgets = widgets.filter((widget) => widget.type === "STICKER")

    //output version number so it's easier to tell if miro has updated
    let text = "Version: " + version + "\n"

    text += "Title;Biome;Type;Subtype\n"
    
    //Prepare some regex
    const biome_regex = new RegExp("biome:", "i")
    const type_regex = new RegExp("type:", "i")
    const subtype_regex = new RegExp("subtype:", "i")

    //iterate every sticker, skipping those with no tags
    widgets.forEach(widget => {
        if(widget.tags.length > 0)
        {
            const tags = []
            //save the name of every tag on each sticker
            widget.tags.forEach(tag => {
                console.log(String(tag.title))
                tags.push(String(tag.title))
            })

            //Check if this sticker has been marked for ignore
            if(!tags.includes("export-ignore"))
            {
                //The text on the sticker has a bunch of html markup in it, strip that out
                let title = htmlDecode(String(widget.text))

                //This tracks whether we managed to interpret any of the tags on the sticker. If not, we don't print it.
                let identified = false

                let biome = "uncategorised"
                let type = "uncategorised"
                let subtype = "none"

                //Tags should be formatted as below:
                //biome:1
                //type:item
                //subtype:crafted-tool

                //Iterate over each of the sticker's tags, any try to understand them
                tags.forEach(tag => {
                    if(String(tag).match(biome_regex)){
                        biome = "biome " + tag.replace(biome_regex, "")
                        identified = true
                    }
                    //We have to check subtype before type, as the type regex will match both
                    else if(String(tag).match(subtype_regex)){
                        subtype = tag.replace(subtype_regex, "")
                        identified = true
                    }
                    else if(String(tag).match(type_regex)){
                        type = tag.replace(type_regex, "")
                        identified = true
                    }
                    else{ console.log("no match for " + title)}
                })

                //If we understood any of the tags, add this sticker to the output list
                if(identified === true){ text += title + ";" + biome + ";" + type + ";" + subtype +"\n" }
                else{ console.log("unidentified: " + title) }
            }       
        }
    })


    // Check that widget has text field
    if (typeof text === 'string') {
        // hide tip and show text in sidebar
        tipElement.style.opacity = '0'
        widgetTextElement.value = text
    } else {
        // show tip and clear text in sidebar
        tipElement.style.opacity = '1'
        widgetTextElement.value = ''
    }
}

function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }