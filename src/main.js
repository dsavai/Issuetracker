if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready()
}



function ready(){
    const listContainer = document.querySelector('[data-list-container]')
    const newInputDescribe = document.querySelector('[data-new-input-describe]')
    const newSelectSeverity = document.querySelector('#select-severity')
    const newInputAssign = document.querySelector('[data-input-new-assign]')
    const newInputNotes = document.querySelector('[data-input-new-notes]')
    const newListForm = document.querySelector('[data-new-list-form]')
    const addButton = document.querySelector('[data-add-button]')
    const saveButton = document.querySelector('[data-save-button]')

    const LOCAL_STORAGE_ISSUE_KEY = 'issues.lists'
    const lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ISSUE_KEY)) || []


    newListForm.addEventListener('submit', e => {
        e.preventDefault();
        const listDescribe = newInputDescribe.value
        const listSeverity = newSelectSeverity.value
        const listAssign = newInputAssign.value
        const listNotes = newInputNotes.value
        if(listDescribe === "" || listAssign === "" || listNotes === ""){
            return alert("This field can't be empty")
        }
        const item = { listDescribe, listSeverity, listAssign, listNotes } 
        const listItem = createList(item)
        lists.push(listItem)
        newInputDescribe.value = ''
        newInputAssign.value = ''
        newInputNotes.value = ''
        saveAndRender()
    })

   

    function createList(item){
        return {id: Date.now().toString(), title: item.listDescribe, rate: item.listSeverity, assign: item.listAssign, newItem: true, status: 'open', issueNotes: item.listNotes }
    }

    function render(){
        clearElement(listContainer)
        lists.forEach(list => {
            const listElement = document.createElement('div')
            let item = ''
            if(list.newItem === true){
                item = 'Open'
            } 
            listElement.classList.add('col-sm-6')
            listElement.dataset.listId = list.id
            listElement.innerHTML = `
            <div class="card mb-4">
                <div class="card-body">
                    <h2 class="card-title">${list.title}</h2>
                    <h6 class="card-subtitle mb-2 text-muted">
                        <span class="name">${list.assign}</span>
                        <span class="rate">${list.rate}</span>
                    </h6>
                    <p>      
                        <span class="badge badge-secondary">${list.status}</span>
                    </p>
                    <p class="card-text">${list.issueNotes}</p>
                    <p>
                        <button type="button" class="btn btn-danger">Close</button>
                        <button type="button" class="btn btn-warning">Edit</button>
                    </p>
                </div>
            </div>
            `
            listContainer.appendChild(listElement)
            edit(listElement)
        })
    }

    function edit(listElem){
        const editButton = listElem.querySelectorAll('.btn-warning')
        const submitButton = document.querySelector('.btn-primary')
        editButton.forEach(button => {
            button.addEventListener('click', e => {
                const parentIItem = button.closest('.col-sm-6')
                const parentId = parentIItem.dataset.listId
                newInputDescribe.value = ''
                newInputAssign.value = ''
                newInputNotes.value = ''

                lists.forEach(list => {
                    if(list.id === parentId){
                        newInputDescribe.value = newInputDescribe.value + list.title
                        newSelectSeverity.value = newSelectSeverity.value + list.rate
                        newInputAssign.value = newInputAssign.value + list.assign
                        newInputNotes.value = newInputNotes.value + list.issueNotes
                    }
                })
                submitButton.classList.add('d-none')
                saveButton.classList.add('d-block')
                editAddSave(parentId)
            })
        })
    }

    function editAddSave(id){
        saveButton.addEventListener('click', e => {
            e.preventDefault()
            const listDescribe = newInputDescribe.value
            const listSeverity = newSelectSeverity.value
            const listAssign = newInputAssign.value
            const listNotes = newInputNotes.value

            lists.forEach(list => {
                if(list.id === id){
                    list.title = listDescribe
                    list.rate = listSeverity
                    list.assign = listAssign
                    list.issueNotes = listNotes
                    
                }
            })
            addButton.classList.add('d-block')
            saveButton.classList.remove('d-block')
            saveButton.classList.add('d-none')
            saveAndRender()

            newInputDescribe.value = ''
            newInputAssign.value = ''
            newInputNotes.value = ''
        })
    }

    function save(){
        return localStorage.setItem(LOCAL_STORAGE_ISSUE_KEY, JSON.stringify(lists))
    }

    function saveAndRender(){
        save()
        render()
    }

    function clearElement(element){
        while(element.firstChild){
            element.removeChild(element.firstChild)
        }
    }
    render()
   
}

