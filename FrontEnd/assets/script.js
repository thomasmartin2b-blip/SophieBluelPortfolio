 // Récupération des travaux
 let works = []

 async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();

  displayWorks(works) // maj gallerie
}

// Affichage des Travaux
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

// Récupération des catégories
let categories = []

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    categories = await response.json();

    displayCategories(categories) // maj catégories
}

// Mise en place des filtres 
function displayCategories(categories) {
    const filters = document.querySelector(".filters")
// Filtres "Tous"
    const allButton = document.createElement("button")
    allButton.textContent = "Tous"
    allButton.classList.add("selected")
    allButton.addEventListener("click", () => {
        displayWorks(works) 
        selectedButton(allButton) // Bouton "Tous" sélectionné de base 
    })
    filters.appendChild(allButton)
// Boutons filtres pour chaque catégories
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

// Affichage du bouton filtres sélectionné
function selectedButton(selected) {
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("selected")
  })
  selected.classList.add("selected")
}

getWorks(); 
getCategories();


const token = localStorage.getItem("token") // Récupération du token

// Connexion
if (token) {  
// Mode édition
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


// Affichage de la modale
document.querySelector("#modify").addEventListener("click", () => {
    document.querySelector("#modal-display").classList.remove("hidden")
    displayModalWorks() // Affichage travaux dans modale
})

// Fermer la modale gallerie avec la croix
document.querySelector("#close-modal").addEventListener("click", () => {
    document.querySelector("#modal-display").classList.add("hidden")
})

// Fermer la modale formulaire avec la croix 
document.querySelector("#close-modal-form").addEventListener("click", () => {
    document.querySelector("#modal-display").classList.add("hidden")
})

// Fermer les modales en cliquant ailleurs
document.querySelector("#modal-display").addEventListener("click", (e) => {
    if (e.target === document.querySelector("#modal-display")) {
        document.querySelector("#modal-display").classList.add("hidden")
    }
})

// Changement de modale
document.querySelector("#btn-add-photo").addEventListener("click", () => {
    document.querySelector("#modal-gallery").classList.add("hidden")
    document.querySelector("#modal-form").classList.remove("hidden")
    displayCategoriesInSelect() // Affichage catégories sélecteur
})

// Retour ancienne modale
document.querySelector("#back-to-gallery").addEventListener("click", () => {
    document.querySelector("#modal-form").classList.add("hidden")
    document.querySelector("#modal-gallery").classList.remove("hidden")
})



// Affichage des projets dans la gallerie 
function displayModalWorks() {
    const modalWorks = document.querySelector("#modal-works")
    modalWorks.innerHTML = ""

    works.forEach(work => {
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        img.src = work.imageUrl

// Supprimer des projets 
        const trash = document.createElement("button")
       
        trash.innerHTML = '<i class="fa-solid fa-trash-can" style="color: rgb(255, 255, 255);"></i>'
        trash.addEventListener("click", async () => {
            await fetch(`http://localhost:5678/api/works/${work.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
             })
             works = works.filter(dWorks => dWorks.id !== work.id)
            displayWorks(works)
            displayModalWorks()
        })

        figure.appendChild(img)
        figure.appendChild(trash)
        modalWorks.appendChild(figure)
    })
}

// Ajouter des travaux

// Preview 
document.querySelector("#btn-upload").addEventListener("click", () => {
    document.querySelector("#file-input").click()
})
document.querySelector("#file-input").addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (!file) return
    const preview = document.createElement("img")
    preview.src = URL.createObjectURL(file)
    const uploadZone = document.querySelector("#upload-zone")
    const fileInput = document.querySelector("#file-input") 
    uploadZone.innerHTML = ""
    uploadZone.style.padding = "0"
    uploadZone.appendChild(preview)
    uploadZone.appendChild(fileInput) 
})

// Afficher les catégories sur le sélecteur 
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

// Vérification des champs 
function checkForm() {
    const title = document.querySelector("#title-input").value
    const category = document.querySelector("#category-select").value
    const file = document.querySelector("#file-input").files[0]

    if (title && category && file) {
        document.querySelector("#btn-validate").style.backgroundColor = "#1D6154"
    } else {
        document.querySelector("#btn-validate").style.backgroundColor = "#A7A7A7"
    }
}
document.querySelector("#title-input").addEventListener("input", checkForm)
document.querySelector("#category-select").addEventListener("change", checkForm)
document.querySelector("#file-input").addEventListener("change", checkForm)

// Récupération des données 
document.querySelector("#btn-validate").addEventListener("click", async () => {
    const title = document.querySelector("#title-input").value
    const category = document.querySelector("#category-select").value
    const file = document.querySelector("#file-input").files[0]


// Message d'erreur si mal rempli
    if (!title || !category || !file ) {
        document.querySelector("#form-error").textContent = "Veuillez remplir tous les champs"
        return
    }

// Envoi des données à l'API
    const formData = new FormData()
    formData.append("title", title)
    formData.append("category", parseInt(category))
    formData.append("image", file)


// Récupération réponse API
    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData   
    })

// Succès 
    if (response.ok) {
        const newWork = await response.json()
        works.push(newWork) // add
        displayWorks(works) // maj gallery
        displayModalWorks() // maj modal
        document.querySelector("#modal-display").classList.add("hidden")
// Echec 
    } else {
        document.querySelector("#form-error").textContent = "Une erreur est survenue"
    }
})
