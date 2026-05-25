 let works = []

 async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();

  displayWorks(works)
}

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach(work => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
}

let categories = []

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    categories = await response.json();

    displayCategories(categories)
}

function displayCategories(categories) {
    const filters = document.querySelector(".filters")

    const allButton = document.createElement("button")
    allButton.textContent = "Tous"
    allButton.classList.add("selected")
    allButton.addEventListener("click", () => {
        displayWorks(works)
        selectedButton(allButton)
    })
    filters.appendChild(allButton)

    categories.forEach(category => {
        const button = document.createElement("button")
        button.textContent = category.name
        button.addEventListener("click", () => {
            const filtered = works.filter(work => work.categoryId === category.id)
            displayWorks(filtered)
            selectedButton(button)
        })
        filters.appendChild(button)
    })
}

function selectedButton(selected) {
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("selected")
  })
  selected.classList.add("selected")
}


getWorks();
getCategories();


const token = localStorage.getItem("token")

if (token) {
  
const loginlink = document.querySelector("#loginlink")
loginlink.textContent = "logout"
loginlink.addEventListener("click", () => {
        localStorage.removeItem("token")
        window.location.href = "index.html"
    })

document.querySelector(".filters").style.display = "none"
document.querySelector("#edit-mode").classList.remove("hidden")
document.querySelector("#modify").classList.remove("hidden")
document.querySelector("#modify").style.marginBottom = "100px"
}



document.querySelector("#modify").addEventListener("click", () => {
    document.querySelector("#modal-display").classList.remove("hidden")
    displayModalWorks()
})

document.querySelector("#close-modal").addEventListener("click", () => {
    document.querySelector("#modal-display").classList.add("hidden")
})

document.querySelector("#modal-display").addEventListener("click", (e) => {
    if (e.target === document.querySelector("#modal-display")) {
        document.querySelector("#modal-display").classList.add("hidden")
    }
})

document.querySelector("#btn-add-photo").addEventListener("click", () => {
    document.querySelector("#modal-gallery").classList.add("hidden")
    document.querySelector("#modal-form").classList.remove("hidden")
    displayCategoriesInSelect()
})

document.querySelector("#back-to-gallery").addEventListener("click", () => {
    document.querySelector("#modal-form").classList.add("hidden")
    document.querySelector("#modal-gallery").classList.remove("hidden")
})

document.querySelector("#close-modal-form").addEventListener("click", () => {
    document.querySelector("#modal-display").classList.add("hidden")
})

function displayModalWorks() {
    const modalWorks = document.querySelector("#modal-works")
    modalWorks.innerHTML = ""

    works.forEach(work => {
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        img.src = work.imageUrl

        const trash = document.createElement("button")
        trash.innerHTML = '<i class="fa-solid fa-trash-can" style="color: rgb(255, 255, 255);"></i>'

        figure.appendChild(img)
        figure.appendChild(trash)
        modalWorks.appendChild(figure)
    })
}

function displayCategoriesInSelect() {
    const select = document.querySelector("#category-select")
    select.innerHTML = "<option value=''></option>"

    categories.forEach(category => {
        const option = document.createElement("option")
        option.value = category.id
        option.textContent = category.name
        select.appendChild(option)
    })
}
