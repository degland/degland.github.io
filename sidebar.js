miro.onReady(() => {
    // subscribe on user selected widgets
    miro.addListener(miro.enums.event.SELECTION_UPDATED, generateList)
    generateList()
})

// Get html elements for tip and text container
const tipElement = document.getElementById('tip')
const widgetTextElement = document.getElementById('widget-text')

async function generateList() {
    // Get selected widgets
    let widgets = await miro.board.selection.get()

    widgets = widgets.filter((widget) => widget.type === "STICKER")


    let text = "5 \n"
    
    const html_trim_regex = new RegExp("<\/?\w+>")
    const test_regex =  new RegExp("wiz")

    widgets.forEach(widget => {
        let tags = []
        widget.tags.foreach(tag => {
            tags.append(tag.title)
            text += tag.title + "\n"
        })

        text += "-----\n"


        let label = widget.text
        label = label.replace(html_trim_regex, "")
        text += label + "\n"
        let label2 = "wizard2"
        label2 = label2.replace(test_regex, "")
        text += label2 + "\n"
    });

    
    

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