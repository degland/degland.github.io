miro.onReady(() => {
    // subscribe on user selected widgets
    miro.addListener(miro.enums.event.SELECTION_UPDATED, generateList)
    generateList()
})

// Get html elements for tip and text container
const tipElement = document.getElementById('tip')
const widgetTextElement = document.getElementById('widget-text')

const version = 25

async function generateList() {
    let widgets = await miro.board.widgets.get()

    widgets = widgets.filter((widget) => widget.type === "STICKER")

    let text = "" + version + "\n"
    
    const html_trim_regex = new RegExp("<\/?\w+>", "g")
    const biome_regex = new RegExp("biome:", "i")
    const type_regex = new RegExp("type:", "i")
    const subtype_regex = new RegExp("subtype:", "i")

    widgets.forEach(widget => {
        if(widget.tags.length > 0)
        {
            const tags = []
            widget.tags.forEach(tag => {
                console.log(String(tag.title))
                tags.push(String(tag.title))
            })

            text += "-----\n"

            if(!tags.includes("export-ignore"))
            {
                let title = String(widget.text).replace(html_trim_regex,"")
                console.log(widget.text)
                console.log("replaced + " + title)

                let identified = false

                let biome = "uncategorised"
                let type = "uncategorised"
                let subtype = "none"

                //biome:1
                //type:item
                //subtype:crafted-tool

                tags.forEach(tag => {
                    console.log(String(tag))
                    if(String(tag).match(biome_regex)){
                        biome = tag.replace(biome_regex, "")
                        identified = true
                    }
                    
                    else if(String(tag).match(subtype_regex)){
                        subtype = tag.replace(subtype_regex, "")
                        identified = true
                    }
                    else if(String(tag).match(type_regex)){
                        type = tag.replace(type_regex, "")
                        identified = true
                    }
                    else{ console.log("no match")}
                })

                if(identified === true){ text += title + ", " + biome + ", " + type + ", " + subtype +",\n" }
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