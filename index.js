
/* Dummy data array */
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
];
let filteredArray = []; // Filtered Array list
let selectedIndex = null; // current selected card index information in UI
let previousIndex = null; // previous selected card index information in UI
document.onkeydown = checkKey; // Add Key event
/**
 * This method used for replace all for in case sensitive mode
 */
String.prototype.replaceAll = function (strReplace, strWith) {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};
/**
 * This method used to filer array and search
 * @param {string} search 
 */
function displayArray(search = '') {
    const actualArray = [...mockUserArray];
    const userSectionUI = `
                <h3><b>{{id}}</b></h3>
                <h4><b><i>{{name}}</i></b></h4>
                {{itemSearch}}
                <p>{{address}} {{pincode}}</p>
            `;
    const filterObj = {
        "id": search.toLowerCase(),
        "name": search.toLowerCase(),
        "items": search.toLowerCase(),
        "address": search.toLowerCase(),
        "pincode": search.toLowerCase(),
    };
    filteredArray = search && search.trim().length ? actualArray.filter((item, index) => {
        let notMatchingField = Object.keys(filterObj)
            .find(key => item[key] instanceof Array ? item[key].join(' ').toLowerCase().includes(filterObj[key]) : item[key].toLowerCase().includes(filterObj[key]));
        if (notMatchingField === 'items') {
            actualArray[index].searchByItemsValue = item.items.findIndex((item) => item.toLowerCase().includes(search.toLowerCase()));
        }
        return notMatchingField;
    }) : [...actualArray];
    const listUserHtml = filteredArray.map((userInformation, index) => {
        let uiInfo = userSectionUI;
        if (typeof userInformation.searchByItemsValue === 'number') {
            uiInfo = uiInfo.replace(new RegExp(`{{itemSearch}}`, "g"), `<ul>
            <li>
            <span class="capitalize"> ${userInformation.items[userInformation.searchByItemsValue]} </span> found in items
            </li>
        </ul>`);
        } else {
            uiInfo = uiInfo.replace(new RegExp(`{{itemSearch}}`, "g"), '');
        }
        delete userInformation.searchByItemsValue;
        for (let key in userInformation) {
            uiInfo = uiInfo.replace(new RegExp("{{" + key + "}}", "g"), userInformation[key]);
        }
        uiInfo = uiInfo.replace(new RegExp("{{index}}", "g"), index);
        uiInfo = uiInfo.replace(/(\{{).+?(\}})/g, " ");
        if (search)
            uiInfo = uiInfo.replaceAll(search, `<span class="search-key">${search.toLowerCase()}</span>`);
        uiInfo = `<div class="card" id="{{id}}" onclick="onSelect('{{index}}')">
        <div class="container">${uiInfo}
        </div>
        </div>`
        return uiInfo;
    }).join('');
    document.getElementById('listUser').innerHTML = listUserHtml || `<div class="card" id="{{id}}" onclick="onSelect('{{index}}')">
            <div class="container">
                <div class="no-data">
                    No User Found
                </div>
            </div>
        </div>`;
}

/**
 * This method used to detect upper/down key keyboard event
 * @param {object} e 
 */
function checkKey(e) {
    e = e || window.event;
    switch (e.keyCode) {
        case 38:
            // up arrow
            e.preventDefault();
            onNavigation('up');
            break;
        case 40:
            // down arrow
            e.preventDefault();
            onNavigation('down');
            break;
        default:
            break;
    }
}
/**
 * This method used to set selected element index according to keyboard navigation direction
 * @param {string} navDirection 'up | down'
 */
function onNavigation(navDirection) {
    if (typeof selectedIndex !== 'number' && filteredArray.length) {
        selectedIndex = navDirection === 'up' ? filteredArray.length - 1 : 0;
    } else if (typeof selectedIndex === 'number' && filteredArray.length) {
        if (navDirection === 'up') {
            selectedIndex = selectedIndex === 0 ? filteredArray.length - 1 : selectedIndex - 1;
        } else {
            selectedIndex = selectedIndex === filteredArray.length - 1 ? 0 : selectedIndex + 1;
        }
    }
    if (typeof selectedIndex === 'number') {
        onSelectElement();
    }
}

/**
 * This method used to set style or class on selected element  
 */
function onSelectElement() {
    const selectedElement = document.getElementById(filteredArray[selectedIndex].id);
    if (selectedElement) {
        if (!checkElementOnScreen(selectedElement)) {
            selectedElement.scrollIntoView();
        }
        selectedElement.classList.add("active");
        if (typeof previousIndex === 'number') {
            const preSelectedElement = document.getElementById(filteredArray[previousIndex].id);
            if (preSelectedElement) {
                preSelectedElement.classList.remove("active");
            }
        }
        previousIndex = selectedIndex;
    }
}

/**
 * This method used to check selected element on visible on screen or not
 * If no move it to in view using scroll event
 * @param {string} id 
 */
function checkElementOnScreen(selectedElement) {
    const rect = selectedElement.getBoundingClientRect();
    const isInViewport = rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    return isInViewport;
}
/**
 * This method used to perform click event on select card
 * @param {string} id 
 */
function onSelect(id) {
    id = Number(id)
    if (!isNaN(id) && selectedIndex !== id) {
        selectedIndex = id;
        onSelectElement();
    }
}
/**
 * This method used to filter using search input box
 */
function onSearch(obj) {
    selectedIndex = null;
    previousIndex = null;
    displayArray(obj.value);
}
/**
 * Call method at onload to display initial list
 */
displayArray();