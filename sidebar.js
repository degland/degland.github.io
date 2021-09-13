miro.onReady(() => {
    // subscribe on user selected widgets
    miro.addListener(miro.enums.event.SELECTION_UPDATED, generateList)
    generateList()
})

// Get html elements for tip and text container
const tipElement = document.getElementById('tip')
const widgetTextElement = document.getElementById('widget-text')

const version = 16

async function generateList() {
    let widgets = await miro.board.widgets.get()

    widgets = widgets.filter((widget) => widget.type === "STICKER")

    let text = "" + version + "\n"
    
    const html_trim_regex = new RegExp("<\/?\w+>")
    const test_regex =  new RegExp("wiz")
    const biome_regex = new RegExp("Biome:")
    const type_regex = new RegExp("Type:")
    const subtype_regex = new RegExp("Subtype:")

    widgets.forEach(widget => {
        let tags = []

        widget.tags.forEach(tag => {
            // text += "-----\n"
            tags.push(String(tag.title))
            console.log(String(tag.title))
            // text += tag.title + "\n"
        })

        // text += widget.tags[0].title + "\n"
        // text += widget.tags[1].title + "\n"

        text += "-----\n"

        if(!tags.includes("export-ignore"))
        {

            let line = ""

            let title = widget.text.replace(html_trim_regex,"")

            let identified = false

            let biome = "uncategorised"
            let type = "uncategorised"
            let subtype = "uncategorised"

            //format the tag sort of like json?

            //biome:1
            //type:item
            //subtype:crafted-tool

            tags.array.forEach(tag => {
                if(tag.match(biome_regex)){
                    biome = tag.replace(biome_regex, "")
                    identified = true
                }
                else if(tag.match(type_regex)){
                    type = tag.replace(type_regex, "")
                    identified = true
                }
                else if(tag.match(subtype_regex)){
                    subtype = tag.replace(subtype_regex, "")
                    identified = true
                }
            })

            // if(identified === true){ text += title + ", " + biome + ", " + type + ", " + subtype +",\n" }


            let label = widget.text
            label = label.replace(html_trim_regex, "")
            text += label + "\n"

            // let label2 = "wizard2"
            // label2 = label2.replace(test_regex, "")
            // text += label2 + "\n"
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