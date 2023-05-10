export function clearObject(shapes){
    shapes.coordinates = []
    shapes.itemsIds = []
    return shapes
}

export function deleteForIndex(delIndex,coordinates){
    let value = delIndex
    let arr = coordinates
    arr = arr.filter(item => item !== value)
    console.log(arr)

    const array = coordinates;
    const index = delIndex;
    if (index > -1) { 
        array.splice(index, 1);
    }
    return array
}

export function hideForm(){
    const card = document.getElementById('addForm');

    card.addEventListener('click', function () {
        var navMenu = document.getElementById("main-content");
        navMenu.classList.toggle("hidden");
    })
}