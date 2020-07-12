
/**
 * This method used for replace all for in case sensitive mode
 */
String.prototype.replaceAll = function (strReplace, strWith) {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};
function autocomplete(inp, arr) {
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        const selectedElementDiv = document.getElementById('selected-item');
        selectedElementDiv.style.display = 'none';
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        const userSectionUI = `
                <h3><b>{{id}}</b></h3>
                <h4><b><i>{{name}}</i></b></h4>
                {{itemSearch}}
                <p>{{address}} {{pincode}}</p>
            `;
        const filterObj = {
            "id": val.toLowerCase(),
            "name": val.toLowerCase(),
            "items": val.toLowerCase(),
            "address": val.toLowerCase(),
            "pincode": val.toLowerCase(),
        };
        filteredArray = val && val.trim().length ? arr.filter((item, index) => {
            let notMatchingField = Object.keys(filterObj)
                .find(key => item[key] instanceof Array ? item[key].join(' ').toLowerCase().includes(filterObj[key]) : item[key].toLowerCase().includes(filterObj[key]));
            if (notMatchingField === 'items') {
                arr[index].searchByItemsValue = item.items.findIndex((item) => item.toLowerCase().includes(val.toLowerCase()));
            }
            return notMatchingField;
        }) : [...arr];
        if (!filteredArray.length) {
            return a.innerHTML = `<div class="no-data">
            No User Found
        </div>`
        }
        filteredArray.forEach((userInformation, index) => {
            let uiInfo = userSectionUI;
            if (typeof userInformation.searchByItemsValue === 'number') {
                uiInfo = uiInfo.replace(new RegExp(`{{itemSearch}}`, "g"), `<ul>
            <li>
            <span class="capitalize"> ${
                userInformation.items[userInformation.searchByItemsValue].replaceAll(val, `<span class="search-key">${val.toLowerCase()}</span>`)
            } </span> found in items
            </li>
        </ul>`);
            } else {
                uiInfo = uiInfo.replace(new RegExp(`{{itemSearch}}`, "g"), '');
            }
            delete userInformation.searchByItemsValue;
            for (let key in userInformation) {
                if (typeof userInformation[key] === 'string') {
                    uiInfo = uiInfo.replace(new RegExp("{{" + key + "}}", "g"),  userInformation[key].replaceAll(val, `<span class="search-key">${val.toLowerCase()}</span>`));
                }
               
            }
            uiInfo = uiInfo.replace(new RegExp("{{index}}", "g"), index);
            uiInfo = uiInfo.replace(/(\{{).+?(\}})/g, " ");
            // if (val)
            //     uiInfo = uiInfo.replaceAll(val, `<span class="search-key">${val.toLowerCase()}</span>`);

            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            b.innerHTML = uiInfo;
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function (e) {
                console.log(e)
                /*insert the value for the autocomplete text field:*/
                const selectedElementDiv = document.getElementById('selected-item');
                selectedElementDiv.innerHTML = `<h3> Selected Infomation </h3> <br/> ${b.innerHTML}`;
                selectedElementDiv.style.display = 'block';
                // selectedElementDiv.innerHTML = e.target.i
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
        });
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        const x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

/*An array containing all the user information*/
const mockUserArray = [
    {
        "id": "123-s2-546",
        "name": "John Jacobs",
        "items": ["bucket", "bottle"],
        "address": "1st Cross, 9th Main, abc Apartment",
        "pincode": "5xx012"
    },
    {
        "id": "123-s3-146",
        "name": "David Mire",
        "items": ["Bedroom Set"],
        "address": "2nd Cross, BTI Apartment",
        "pincode": "4xx012"
    },
    {
        "id": "223-a1-234",
        "name": "Soloman Marshall",
        "items": ["bottle"],
        "address": "Riverbed Apartment",
        "pincode": "4xx032"
    },
    {
        "id": "121-s2-111",
        "name": "Ricky Beno",
        "items": ["Mobile Set"],
        "address": "Sunshine City",
        "pincode": "5xx072"
    },
    {
        "id": "123-p2-246",
        "name": "Sikander Singh",
        "items": ["Air Conditioner"],
        "address": "Riverbed Apartment",
        "pincode": "4xx032"
    },
    {
        "id": "b23-s2-321",
        "name": "Ross Wheeler",
        "items": ["Mobile"],
        "address": "1st Cross, 9th Main, abc Apartement",
        "pincode": "5xx012"
    },
    {
        "id": "113-n2-563",
        "name": "Ben Bish",
        "items": ["Kitchen Set", "Chair"],
        "address": "Sunshine City",
        "pincode": "5xx072"
    },
    {
        "id": "323-s2-112",
        "name": "John Michael",
        "items": ["Refrigerator"],
        "address": "1st Cross, 9th Main, abc Apartement",
        "pincode": "5xx012"
    },
    {
        "id": "abc-34-122",
        "name": "Jason Jordan",
        "items": ["Mobile"],
        "address": "Riverbed Apartment",
        "pincode": "4xx032"
    }
];;

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), mockUserArray);