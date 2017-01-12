/**
 * Created by srini on 10/23/2016.
 */

/*
 *  Function need to call on load of the document
 * */
$( document ).ready
(
    init_system
);


/* constant variables */
const TRUE                  = true;
const FALSE                 = false;
const NEW_BILLS             = FALSE;
const ACTIVE_BILLS          = TRUE;
const COM_HOUSE             = 2;
const COM_SENATE            = 3;
const COM_JOINT             = 4;
const LEG_BY_STATE          = 5;
const LEG_BY_HOUSE          = 6;
const LEG_BY_SENATE         = 7;
const FAV_LEG_STATE         = 8;
const FAV_LEG_HOUSE         = 9;
const FAV_LEG_SENATE        = 10;
const FAV_ACTIVE_BILL       = 11;
const FAV_NEW_BILL          = 12;
const FAV_COM_HOUSE         = 13;
const FAV_COM_SENATE        = 14;
const FAV_COM_JOINT         = 15;
const FAV_LEG_TABLE         = 100;
const FAV_COM_TABLE         = 200;
const FAV_BILL_TABLE        = 300;
const COM_HOUSE_STR         = "COM_HOUSE_STR";
const COM_SENATE_STR        = "COM_SENATE_STR";
const COM_JOINT_STR         = "COM_JOINT_STR";
const LEG_BY_STATE_STR      = "LEG_BY_STATE_STR";
const LEG_BY_HOUSE_STR      = "LEG_BY_HOUSE_STR";
const LEG_BY_SENATE_STR     = "LEG_BY_SENATE_STR";
const NEW_BILLS_STR         = "NEW_BILLS_STR";
const ACTIVE_BILLS_STR      = "ACTIVE_BILLS_STR";
const DEFAULT_STATE_STR     = "ZZZZ";
const FAV_LEG_STATE_STR     = "FAV_LEG_STATE_STR";
const FAV_LEG_HOUSE_STR     = "FAV_LEG_HOUSE_STR";
const FAV_LEG_SENATE_STR    = "FAV_LEG_SENATE_STR";
const FAV_ACTIVE_BILL_STR   = "FAV_ACTIVE_BILL_STR";
const FAV_NEW_BILL_STR      = "FAV_NEW_BILL_STR";
const FAV_COM_HOUSE_STR     = "FAV_COM_HOUSE_STR";
const FAV_COM_SENATE_STR    = "FAV_COM_SENATE_STR";
const FAV_COM_JOINT_STR     = "FAV_COM_JOINT_STR";


/* Global variables section */
var request               = null;
var bill_type_needed      = ACTIVE_BILLS;
var comm_type_needed      = COM_HOUSE;
var header_nav_bar_active = 0;
var local_storage_support = FALSE;
var leg_type_needed       = LEG_BY_STATE;
var fav_leg_table_remove_idx  = 0;
var fav_bill_table_remove_idx  = 0;
var fav_comm_table_remove_idx  = 0;
var global_bill_details = 0;
var global_comm_details = 0;
var current_page_index  = 1;


function display_paginated_rows(selectedIndex, pagesPerIndex, maxIndex, tableIndex)
{
    var selectedDocument;

    if(tableIndex == 1)
    {
        selectedDocument = document.getElementById('id_leg_table').getElementsByTagName('tr');
    }
    else
    if(tableIndex == 1)
    {
        selectedDocument = document.getElementById('id_bill_type').getElementsByTagName('tr');
    }
    else
    {
        selectedDocument = document.getElementById('id_comm_table').getElementsByTagName('tr');
    }

    /* hide previous rows */
    for(var prevIndex = 1; prevIndex < selectedIndex; ++prevIndex)
    {
        for(rowNumber = ((prevIndex - 1) * pagesPerIndex) + 1; rowNumber <= ((prevIndex - 1) * pagesPerIndex + pagesPerIndex); ++rowNumber)
        {
            selectedDocument[rowNumber].style.display = "none";
        }
    }

    /* show selected index rows */
    for(var prevIndex = selectedIndex; prevIndex <= selectedIndex; ++prevIndex)
    {
        for(rowNumber = ((prevIndex - 1) * pagesPerIndex); rowNumber < ((prevIndex - 1) * pagesPerIndex + pagesPerIndex); ++rowNumber)
        {
            selectedDocument[rowNumber].style.display = "";
        }
    }

    /* hide future rows */
    for(var prevIndex = selectedIndex + 1; prevIndex <= maxIndex; ++prevIndex)
    {
        for(rowNumber = ((prevIndex - 1) * pagesPerIndex); rowNumber < ((prevIndex - 1) * pagesPerIndex + pagesPerIndex); ++rowNumber)
        {
            selectedDocument[rowNumber].style.display = "none";
        }
    }
}

function sort_state(stateFilter)
{
    var stateNameFilter = stateFilter.split("_");
    var stateName       = stateNameFilter.length == 2 ? (stateNameFilter[0] + " " + stateNameFilter[1]) : stateNameFilter[0];
    var tableRows       = document.getElementById('id_leg_table').getElementsByTagName('tr');

    for(var rowCount = 1; rowCount < tableRows.length; ++rowCount)
    {
        if( stateName == DEFAULT_STATE_STR || tableRows[rowCount].getElementsByTagName('td')[4].innerHTML == stateName)
        {
            tableRows[rowCount].style.display = "";
        }
        else
        {
            tableRows[rowCount].style.display = "none";
        }
    }

    if(stateName == DEFAULT_STATE_STR)
    {
        display_paginated_rows(current_page_index, 10, 54, 1);
    }
    else
    {
        ;
    }
}

function search_state()
{
    var textInput = document.getElementById("id_input_state_search").value;
    var tableRows = document.getElementById('id_leg_table').getElementsByTagName('tr');

    for(var rowCount = 1; rowCount < tableRows.length; ++rowCount)
    {
        if( tableRows[rowCount].getElementsByTagName('td')[1].innerHTML.toUpperCase().indexOf(textInput.toUpperCase()) >  -1 ||
            tableRows[rowCount].getElementsByTagName('td')[2].innerHTML.toUpperCase().indexOf(textInput.toUpperCase()) >  -1 ||
            tableRows[rowCount].getElementsByTagName('td')[3].innerHTML.toUpperCase().indexOf(textInput.toUpperCase()) >  -1 ||
            tableRows[rowCount].getElementsByTagName('td')[4].innerHTML.toUpperCase().indexOf(textInput.toUpperCase()) >  -1
          )
        {
            tableRows[rowCount].style.display = "";
        }
        else
        {
            tableRows[rowCount].style.display = "none";
        }
    }
}

function prepare_search_box()
{
    var output;

    output = '<input type="text" id="id_input_state_search" onkeyup="search_state()" placeholder="Search">';

    return output;
}

function prepareDropDown ()
{
    var output;

    output  = '<select>';
    output +='<option onclick = sort_state(\"' + DEFAULT_STATE_STR + '\") >All States </option>';
    output +='<option onclick = sort_state(\"Alabama\")       >Alabama       </option>'; output +='<option onclick = sort_state(\"Alaska\")        >Alaska        </option>';
    output +='<option onclick = sort_state(\"Arizona\")       >Arizona       </option>'; output +='<option onclick = sort_state(\"Arkansas\")      >Arkansas      </option>';
    output +='<option onclick = sort_state(\"California\")    >California    </option>'; output +='<option onclick = sort_state(\"Colorado\")      >Colorado      </option>';
    output +='<option onclick = sort_state(\"Connecticut\")   >Connecticut   </option>'; output +='<option onclick = sort_state(\"Delaware\")      >Delaware      </option>';
    output +='<option onclick = sort_state(\"Florida\")       >Florida       </option>'; output +='<option onclick = sort_state(\"Georgia\")       >Georgia       </option>';
    output +='<option onclick = sort_state(\"Hawaii\")        >Hawaii        </option>'; output +='<option onclick = sort_state(\"Idaho\")         >Idaho         </option>';
    output +='<option onclick = sort_state(\"Illinois\")      >Illinois      </option>'; output +='<option onclick = sort_state(\"Indiana\")       >Indiana       </option>';
    output +='<option onclick = sort_state(\"Iowa\")          >Iowa          </option>'; output +='<option onclick = sort_state(\"Kansas\")        >Kansas        </option>';
    output +='<option onclick = sort_state(\"Kentucky\")      >Kentucky      </option>'; output +='<option onclick = sort_state(\"Louisiana\")     >Louisiana     </option>';
    output +='<option onclick = sort_state(\"Maine\")         >Maine         </option>'; output +='<option onclick = sort_state(\"Maryland\")      >Maryland      </option>';
    output +='<option onclick = sort_state(\"Massachusetts\") >Massachusetts </option>'; output +='<option onclick = sort_state(\"Michigan\")      >Michigan      </option>';
    output +='<option onclick = sort_state(\"Minnesota\")     >Minnesota     </option>'; output +='<option onclick = sort_state(\"Mississippi\")   >Mississippi   </option>';
    output +='<option onclick = sort_state(\"Missouri\")      >Missouri      </option>'; output +='<option onclick = sort_state(\"Montana\")       >Montana       </option>';
    output +='<option onclick = sort_state(\"Nebraska\")      >Nebraska      </option>'; output +='<option onclick = sort_state(\"Nevada\")        >Nevada        </option>';
    output +='<option onclick = sort_state(\"New_Hampshire\") >New Hampshire </option>'; output +='<option onclick = sort_state(\"New_Jersey\")    >New Jersey    </option>';
    output +='<option onclick = sort_state(\"New_Mexico\")    >New Mexico    </option>'; output +='<option onclick = sort_state(\"New_York\")      >New York      </option>';
    output +='<option onclick = sort_state(\"North_Carolina\")>North Carolina</option>'; output +='<option onclick = sort_state(\"North_Dakota\")  >North Dakota  </option>';
    output +='<option onclick = sort_state(\"Ohio\")          >Ohio          </option>'; output +='<option onclick = sort_state(\"Oklahoma\")      >Oklahoma      </option>';
    output +='<option onclick = sort_state(\"Oregon\")        >Oregon        </option>'; output +='<option onclick = sort_state(\"Pennsylvania\")  >Pennsylvania  </option>';
    output +='<option onclick = sort_state(\"Rhode_Island\")  >Rhode Island  </option>'; output +='<option onclick = sort_state(\"South_Carolina\")>South Carolina</option>';
    output +='<option onclick = sort_state(\"South_Dakota\")  >South Dakota  </option>'; output +='<option onclick = sort_state(\"Tennessee\")     >Tennessee     </option>';
    output +='<option onclick = sort_state(\"Texas\")         >Texas         </option>'; output +='<option onclick = sort_state(\"Utah\")          >Utah          </option>';
    output +='<option onclick = sort_state(\"Vermont\")       >Vermont       </option>'; output +='<option onclick = sort_state(\"Virginia\")      >Virginia      </option>';
    output +='<option onclick = sort_state(\"Washington\")    >Washington    </option>'; output +='<option onclick = sort_state(\"West_Virginia\") >West Virginia </option>';
    output +='<option onclick = sort_state(\"Wisconsin\")     >Wisconsin     </option>'; output +='<option onclick = sort_state(\"Wyoming\")       >Wyoming       </option>';
    output += '</select>';

    return output;
}

function get_local_storage_data(dataType)
{
    var returnValue;

    if(local_storage_support == FALSE)
    {
        returnValue =  null;
    }
    else
    {
        switch (dataType)
        {
            case COM_HOUSE:
            {
                returnValue = localStorage.getItem(COM_HOUSE_STR);

                break;
            }
            case COM_SENATE:
            {
                returnValue = localStorage.getItem(COM_SENATE_STR);

                break;
            }
            case COM_JOINT:
            {
                returnValue = localStorage.getItem(COM_JOINT_STR);

                break;
            }
            case LEG_BY_STATE:
            {
                returnValue = localStorage.getItem(LEG_BY_STATE_STR);

                break;
            }
            case LEG_BY_HOUSE:
            {
                returnValue = localStorage.getItem(LEG_BY_HOUSE_STR);

                break;
            }
            case LEG_BY_SENATE:
            {
                returnValue = localStorage.getItem(LEG_BY_SENATE_STR);

                break;
            }
            case NEW_BILLS:
            {
                returnValue = localStorage.getItem(NEW_BILLS_STR);

                break;
            }
            case ACTIVE_BILLS:
            {
                returnValue = localStorage.getItem(ACTIVE_BILLS_STR);

                break;
            }
            case FAV_LEG_STATE:
            {
                returnValue = localStorage.getItem(FAV_LEG_STATE_STR);

                break;
            }
            case FAV_LEG_SENATE:
            {
                returnValue = localStorage.getItem(FAV_LEG_SENATE_STR);

                break;
            }
            case FAV_LEG_HOUSE:
            {
                returnValue = localStorage.getItem(FAV_LEG_HOUSE_STR);

                break;
            }
            case FAV_ACTIVE_BILL:
            {
                returnValue = localStorage.getItem(FAV_ACTIVE_BILL_STR);

                break;
            }
            case FAV_NEW_BILL:
            {
                returnValue = localStorage.getItem(FAV_NEW_BILL_STR);

                break;
            }
            case FAV_COM_HOUSE:
            {
                returnValue = localStorage.getItem(FAV_COM_HOUSE_STR);

                break;
            }
            case FAV_COM_SENATE:
            {
                returnValue = localStorage.getItem(FAV_COM_SENATE_STR);

                break;
            }
            case FAV_COM_JOINT:
            {
                returnValue = localStorage.getItem(FAV_COM_JOINT_STR);

                break;
            }
        }
    }

    return returnValue;
}

function store_local_storage_data(dataType, dataToStore)
{
    if(local_storage_support == FALSE)
    {
        ;
    }
    else
    {
        switch (dataType)
        {
            case COM_HOUSE:
            {
                localStorage.setItem(COM_HOUSE_STR, dataToStore);

                break;
            }
            case COM_SENATE:
            {
                localStorage.setItem(COM_SENATE_STR, dataToStore);

                break;
            }
            case COM_JOINT:
            {
                localStorage.setItem(COM_JOINT_STR, dataToStore);

                break;
            }
            case LEG_BY_STATE:
            {
                localStorage.setItem(LEG_BY_STATE_STR, dataToStore);

                break;
            }
            case LEG_BY_HOUSE:
            {
                localStorage.setItem(LEG_BY_HOUSE_STR, dataToStore);

                break;
            }
            case LEG_BY_SENATE:
            {
                localStorage.setItem(LEG_BY_SENATE_STR, dataToStore);

                break;
            }
            case NEW_BILLS:
            {
                localStorage.setItem(NEW_BILLS_STR, dataToStore);

                break;
            }
            case ACTIVE_BILLS:
            {
                localStorage.setItem(ACTIVE_BILLS_STR, dataToStore);

                break;
            }
            case FAV_LEG_STATE:
            {
                localStorage.setItem(FAV_LEG_STATE_STR, dataToStore);

                break;
            }
            case FAV_LEG_SENATE:
            {
                localStorage.setItem(FAV_LEG_SENATE_STR, dataToStore);

                break;
            }
            case FAV_LEG_HOUSE:
            {
                localStorage.setItem(FAV_LEG_HOUSE_STR, dataToStore);

                break;
            }
            case FAV_ACTIVE_BILL:
            {
                localStorage.setItem(FAV_ACTIVE_BILL_STR, dataToStore);

                break;
            }
            case FAV_NEW_BILL:
            {
                localStorage.setItem(FAV_NEW_BILL_STR, dataToStore);

                break;
            }
            case FAV_COM_HOUSE:
            {
                localStorage.setItem(FAV_COM_HOUSE_STR, dataToStore);

                break;
            }
            case FAV_COM_SENATE:
            {
                localStorage.setItem(FAV_COM_SENATE_STR, dataToStore);

                break;
            }
            case FAV_COM_JOINT:
            {
                localStorage.setItem(FAV_COM_JOINT_STR, dataToStore);

                break;
            }

        }
    }
}

function prepareUrl (reqInfo, defaultFunc, dataType)
{
    var localStorageData = null;
    //var req_url  = 'http://cs-server.usc.edu:36076/hw_8.php?option=' + reqInfo + '&bioId=0';
    var req_url  = 'http://congress.wfchgz3zqd.us-west-2.elasticbeanstalk.com/hw_8.php?option=' + reqInfo + '&bioId=0';
    var req_type = 'GET';

    localStorageData = get_local_storage_data(dataType);

    if(localStorageData == null)
    {
        /* One of the costliest function call that can be done by this module :( */
        $.ajax
        (
            {
                type : req_type,
                url  : req_url,
                success: function (response)
                {
                    defaultFunc(response);
                }
            }
        );
    }
    else
    {
        /* I'm very happy, data is already in local storage :) */
        defaultFunc(localStorageData);
    }
}

function getAdditionalData(reqInfo, bioId)
{
    var req_url;

    if(reqInfo == 1)
    {
        //req_url = 'http://cs-server.usc.edu:36076/hw_8.php?option=top_bill&bioId=' + bioId;
        req_url = 'http://congress.wfchgz3zqd.us-west-2.elasticbeanstalk.com/hw_8.php?option=top_bill&bioId=' + bioId;
    }
    else
    {
        //req_url = 'http://cs-server.usc.edu:36076/hw_8.php?option=top_comm&bioId=' + bioId;
        req_url = 'http://congress.wfchgz3zqd.us-west-2.elasticbeanstalk.com/hw_8.php?option=top_comm&bioId=' + bioId;
    }

    $.ajax
    (
        {
            type : 'GET',
            url  : req_url,
            success: function (response)
            {
                if(reqInfo == 1)
                {
                    global_bill_details = response;
                }
                else
                {
                    global_comm_details = response;
                }
            }
        }
    );
}


function checkLocalStorage()
{
    local_storage_support = typeof(Storage) !== "undefined" ? TRUE : FALSE;
}

function init_carousal()
{
    $("#myCarousel").carousel({interval:false});
}

function carousel_prev()
{
    $("#myCarousel").carousel("prev");
}

function carousel_next()
{
    $("#myCarousel").carousel("next");
}

function init_system()
{
    checkLocalStorage();

    init_carousal();

    load_header(1);

    get_leg(1);
}

function get_fav_value(sourceValueInfo)
{
    var favValue;

    switch (sourceValueInfo)
    {
        case LEG_BY_STATE:
        {
            favValue = FAV_LEG_STATE;

            break;
        }
        case LEG_BY_HOUSE:
        {
            favValue = FAV_LEG_HOUSE;

            break;
        }
        case LEG_BY_SENATE:
        {
            favValue = FAV_LEG_SENATE;

            break;
        }
        case ACTIVE_BILLS:
        {
            favValue = FAV_ACTIVE_BILL;

            break;
        }
        case NEW_BILLS:
        {
            favValue = FAV_NEW_BILL;

            break;
        }
        case COM_HOUSE:
        {
            favValue = FAV_COM_HOUSE;

            break;
        }
        case COM_SENATE:
        {
            favValue = FAV_COM_SENATE;

            break;
        }
        case COM_JOINT:
        {
            favValue = FAV_COM_JOINT;

            break;
        }

    }

    return favValue;
}

function append_favourite(localStorageIndex, sourceValueInfo)
{
    document.getElementById('fav_button').innerHTML = '<i class="fa fa-star" aria-hidden="true"></i>';

    var favValue = get_fav_value(sourceValueInfo);

    var favStr = get_local_storage_data(favValue);

    if(favStr == null)
    {
        store_local_storage_data(favValue, localStorageIndex.toString());
    }
    else
    {
        if(favStr == "")
        {
            favStr = localStorageIndex.toString();
        }
        else
        {
            favStr = favStr + '+' + localStorageIndex.toString();
        }

        store_local_storage_data(favValue, favStr);
    }

}

function remove_fav (sourceData, valueToRemove, fromTable, tableIdxToRemove)
{
    var tableRows;
    var jsonStrArray = get_local_storage_data(sourceData).split('+');
    var jsonStr;

    if (jsonStrArray[0] == "")
    {
        return;
    }

    jsonStrArray.splice(jsonStrArray.indexOf(valueToRemove.toString()), 1);

    if(fromTable == FAV_LEG_TABLE)
    {
        tableRows = document.getElementById('fav_leg_table').getElementsByTagName('tr');
    }
    else
    if(fromTable == FAV_COM_TABLE)
    {
        tableRows = document.getElementById('fav_com_table').getElementsByTagName('tr');
    }
    else
    {
        tableRows = document.getElementById('fav_bill_table').getElementsByTagName('tr');
    }

    tableRows[tableIdxToRemove + 1].style.display = "none";

    jsonStr = jsonStrArray.length > 0 ? jsonStrArray[0] : "";

    for(var index = 1; index < jsonStrArray.length; ++index)
    {
        jsonStr += '+' + jsonStrArray[index];
    }

    store_local_storage_data(sourceData, jsonStr);

}

function get_fav_leg_data(srcIndexKey, IndexValue)
{
     var output          = "";
     var pureIndexValues = IndexValue.split('+');
     var jsonObj         = JSON.parse(JSON.parse(get_local_storage_data(srcIndexKey)));
     var favValue        = get_fav_value(srcIndexKey);

     for(var idxCount = 0; idxCount < pureIndexValues.length; ++idxCount)
     {
         var legJsonObj = jsonObj.results[Number(pureIndexValues[idxCount])];
        output += '<tr>';
        output += '<td>';
        output += '<button type="button" class="btn btn-default" onclick = "remove_fav(' + favValue + ',' +  Number(pureIndexValues[idxCount]) + ',' +  FAV_LEG_TABLE + ',' +  fav_leg_table_remove_idx + ')"><i class="fa fa-trash" aria-hidden="true"></i></button>';
        output += '</td><td>';
        output += '<img class = "img-auto" src="https://theunitedstates.io/images/congress/original/' + legJsonObj.bioguide_id + '.jpg">';
        output += '</td><td>';
        output += legJsonObj.party == 'R' ? "<img class = \"img-auto\" src = \"./pics/republic.jpg\">" : "<img class = \"img-auto\" src = \"./pics/democrat.jpg\">";
        output += '</td><td>';
        output += legJsonObj.last_name + ", " + legJsonObj.first_name;
        output += '</td><td>';
        output += legJsonObj.chamber == 'senate' ? " <img class = \"img-auto\" src = \"./pics/senate.jpg\">  Senate" : "<img class = \"img-auto\" src = \"./pics/house.jpg\">   House";
        output += '</td><td>';
        output += legJsonObj.state_name;
        output += '</td><td>';
        output += legJsonObj.oc_email == null ? 'N.A.' : ('<a href = "' + legJsonObj.oc_email + '">' + legJsonObj.oc_email.toLowerCase() + '</a>');
        output += '</td><td>';
        output += '<button type="button" class="btn btn-primary" onclick="leg_view_details(' + pureIndexValues[idxCount] + ',' + srcIndexKey + ')">View Details</button>';
        output += '</td></tr>';

         fav_leg_table_remove_idx++;
     }

     return output;
}


function display_leg_fav()
{
     var output            = "";
     var favLegStateStr  = get_local_storage_data(FAV_LEG_STATE);
     var favLegHouseStr  = get_local_storage_data(FAV_LEG_HOUSE);
     var favLegSenateStr = get_local_storage_data(FAV_LEG_SENATE);

    document.getElementById('display-header').innerHTML = '<h3>Legislators</h3>';

    fav_leg_table_remove_idx = 0;

     output  = '<table id = "fav_leg_table" class="table"><thead><tr><th></th><th>Image</th><th>Party</th><th>Name</th><th>Chamber</th><th>State</th><th>Email</th><th></th></tr></thead>';
     output += '<tbody>';
     output += favLegStateStr  == null || favLegStateStr  == "" ? "" : get_fav_leg_data(LEG_BY_STATE,  favLegStateStr);
     output += favLegHouseStr  == null || favLegHouseStr  == "" ? "" : get_fav_leg_data(LEG_BY_HOUSE,  favLegHouseStr);
     output += favLegSenateStr == null || favLegSenateStr == "" ? "" : get_fav_leg_data(LEG_BY_SENATE, favLegSenateStr);
     output += '</tbody></table>';

    document.getElementById('display').innerHTML = output;

}

function get_fav_bill_data(srcIndexKey, IndexValue)
{
    var output          = "";
    var pureIndexValues = IndexValue.split('+');
    var jsonObj         = JSON.parse(JSON.parse(get_local_storage_data(srcIndexKey)));
    var favValue        = get_fav_value(srcIndexKey);

    for(var idxCount = 0; idxCount < pureIndexValues.length; ++idxCount)
    {
        var billJsonObj = jsonObj.results[Number(pureIndexValues[idxCount])];

        output += '<tr>';
        output += '<td>';
        output += '<button type="button" class="btn btn-default" onclick = "remove_fav(' + favValue + ',' +  Number(pureIndexValues[idxCount]) + ',' +  FAV_BILL_TABLE + ',' +  fav_bill_table_remove_idx + ')"><i class="fa fa-trash" aria-hidden="true"></i></button>';
        output += '</td><td>';
        output += billJsonObj.bill_id.toUpperCase();
        output += '</td><td>';
        output += billJsonObj.bill_type.toUpperCase();
        output += '</td><td>';
        output += billJsonObj.official_title;
        output += '</td><td>';
        output += billJsonObj.chamber == 'senate' ? " <img class = \"img-auto\" src = \"./pics/senate.jpg\">  Senate" : "<img class = \"img-auto\" src = \"./pics/house.jpg\">   House";
        output += '</td><td>';
        output += billJsonObj.introduced_on;
        output += '</td><td>';
        output += billJsonObj.sponsor.title + '. ' + billJsonObj.sponsor.last_name + ', ' +  billJsonObj.sponsor.first_name;
        output += '</td><td>';
        output += '<button type="button" class="btn btn-primary" onclick="bill_view_details(' + pureIndexValues[idxCount] + ',' + srcIndexKey + ')">View Details</button>';
        output += '</td></tr>';

        fav_bill_table_remove_idx++;
    }

    return output;
}

function display_bill_fav ()
{
    var output          = "";
    var favActveBillStr = get_local_storage_data(FAV_ACTIVE_BILL);
    var favNewBillStr   = get_local_storage_data(FAV_NEW_BILL);

    document.getElementById('display-header').innerHTML = '<h3>Bills</h3>';

    fav_bill_table_remove_idx = 0;

    output  = '<table id = "fav_bill_table" class="table"><thead><tr><th></th><th>Bill ID</th><th>Bill Type</th><th>Title</th><th>Chamber</th><th>Introduced On</th><th>Sponsor</th><th></th></tr></thead>';
    output += '<tbody>';
    output += favNewBillStr    == null || favNewBillStr    == "" ? "" : get_fav_bill_data(NEW_BILLS,     favNewBillStr);
    output += favActveBillStr  == null || favActveBillStr  == "" ? "" : get_fav_bill_data(ACTIVE_BILLS,  favActveBillStr);
    output += '</tbody></table>';

    document.getElementById('display').innerHTML = output;
}

function leg_view_details(leg_index, legType)
{
    var header;
    var personalInfo;
    var dataToAppend;
    var commData;
    var billData;
    var valueInProgressBar;
    var dateDivisor;

    var response = get_local_storage_data(legType);
    var jsonObj  = JSON.parse(JSON.parse(response)).results[leg_index];

    getAdditionalData(1, jsonObj.bioguide_id);
    getAdditionalData(2, jsonObj.bioguide_id);

    var websiteId  = jsonObj.website     == null ? "" : '<a href = "'                     + jsonObj.website     + '" target="_blank"><img class = \"img-auto\" src = \"./pics/website.jpg\"> </a>';
    var facebookId = jsonObj.facebook_id == null ? "" : '<a href = "http://facebook.com/' + jsonObj.facebook_id + '" target="_blank"><img class = \"img-auto\" src = \"./pics/facebook.jpg\"></a>';
    var twitterId  = jsonObj.twitter_id  == null ? "" : '<a href = "http://twitter.com/'  + jsonObj.twitter_id  + '" target="_blank"><img class = \"img-auto\" src = \"./pics/twitter.jpg\"> </a>';

    dateDivisor = 1000 * 3600 * 24;
    valueInProgressBar = Math.ceil(((new Date() - new Date(jsonObj.term_start)) / dateDivisor) / ((new Date(jsonObj.term_end) - new Date(jsonObj.term_start)) / dateDivisor) * 100);

    header   = '<div>';
    header  += '<span class="col-md-12"><button type="button" class="btn btn-default btn-sm float-left" onclick = "carousel_prev()"><span class="glyphicon glyphicon-menu-left"></span></button> Details';
    header  += '<button type="button" class="btn btn-default btn-sm float-right" id = "fav_button" onclick = "append_favourite(' + leg_index + ',' + legType + ')"><i class="fa fa-star-o" aria-hidden="true"></i></button></span>';
    header  += '</div>';

    personalInfo  = '<table class="table"><tr><td rowspan="5"><img class = "vw-detl-img-auto" src="https://theunitedstates.io/images/congress/original/' + jsonObj.bioguide_id + '.jpg"></td>';
    personalInfo += '<td>' + jsonObj.title + ". " + jsonObj.last_name + ", " +  jsonObj.first_name + '</td></tr>';
    personalInfo += '<tr><td>' + (jsonObj.oc_email == null ? 'N.A.' : ('<a href = "' + jsonObj.oc_email + '">' + jsonObj.oc_email + '</a>')) + '</td></tr>';
    personalInfo += '<tr><td>Chamber: ' + jsonObj.chamber + '</td></tr>';
    personalInfo += '<tr><td>Contact: ' + jsonObj.phone + '</td></tr>';
    personalInfo += '<tr><td>' + (jsonObj.party == 'R' ? '<img class = \"img-auto\" src = \"./pics/republic.jpg\">   Republic' : '<img class = \"img-auto\" src = \"./pics/democrat.jpg\">   Democrat') + '</td></tr>';
    personalInfo += '</table>';

    personalInfo += '<table class="table">';
    personalInfo += '<tr><td>Start Term</td><td>' + moment(jsonObj.term_start).format('MMM DD[,] YYYY') + '</td></tr>';
    personalInfo += '<tr><td>End Term</td><td>' + moment(jsonObj.term_end).format('MMM DD[,] YYYY') + '</td></tr>';
    personalInfo += '<tr><td>Term</td><td>' + '<div class="progress"><div class="progress-bar  progress-bar-success" role="progressbar" aria-valuenow="' + valueInProgressBar + '" aria-valuemin="0" aria-valuemax="100" style="width:' + valueInProgressBar + '%">' + valueInProgressBar + '%</div></div>' + '</td></tr>';
    personalInfo += '<tr><td>Office</td><td>' + jsonObj.office + '</td></tr>';
    personalInfo += '<tr><td>State</td><td>' + jsonObj.state_name + '</td></tr>';
    personalInfo += '<tr><td>Fax</td><td>' + (jsonObj.fax == null ? 'N.A.' : jsonObj.fax) + '</td></tr>';
    personalInfo += '<tr><td>Birthday</td><td>' + moment(jsonObj.birthday).format('MMM DD[,] YYYY') + '</td></tr>';
    personalInfo += '<tr><td>Social Links</td><td>'  + twitterId + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + facebookId + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + websiteId + '</td></tr>';
    personalInfo += '</table>';

    var commObj = JSON.parse(JSON.parse(global_comm_details));

    commData  = '<div><h4>Committees</h4></div><div><table class="table">';
    commData += '<thead><tr><td>Chamber</td><td>Committee ID</td><td>Name</td></tr></thead>';
    commData += '<tbody>';
    for(var i = 0; i < commObj.results.length; ++i)
    {
        commData += '<tr><td>';
        commData +=  commObj.results[i].chamber;
        commData += '</td><td>';
        commData +=  commObj.results[i].committee_id;
        commData += '</td><td>';
        commData +=  commObj.results[i].name;
        commData += '</td></tr>';
    }
    commData += '</tbody></table></div>';

    global_comm_details = 0;

    var billObj = JSON.parse(JSON.parse(global_bill_details));

    billData  = '<div><h4>Bills</h4></div><div><table class="table">';
    billData += '<thead><tr><td>Bill ID</td><td>Title</td><td>Chamber</td><td>Bill Type</td><td>Congress</td><td>Link</td></tr></thead>';
    billData += '<tbody>';
    for(var i = 0; i < billObj.results.length; ++i)
    {
        billData += '<tr><td>';
        billData += billObj.results[i].bill_id.toUpperCase();
        billData += '</td><td>';
        billData += billObj.results[i].official_title;
        billData += '</td><td>';
        billData += billObj.results[i].chamber;
        billData += '</td><td>';
        billData += billObj.results[i].bill_type.toUpperCase();
        billData += '</td><td>';
        billData += billObj.results[i].congress;
        billData += '</td><td>';
        billData += '<a href = "' + billObj.results[i].last_version.urls.pdf + '"target = "_blank"> Link </a>';
        billData += '</td></tr>';
    }
    billData += '</tbody></table></div>';

    global_bill_details = 0;

    dataToAppend = header + '<div class="col-md-6">' + personalInfo + '</div>' + '<div class="col-md-6">' + commData +  billData + '</div>';

    document.getElementById('view_details').innerHTML = dataToAppend;

    carousel_next();

}

function bill_view_details(billIndex, billType)
{
    var response = get_local_storage_data(billType);
    var jsonObj  = JSON.parse(JSON.parse(response)).results[billIndex];

    var header;
    var billInfo;
    var dataToAppend;
    var statusOfBill;
    var pdfObject;

    statusOfBill = jsonObj.history.active == false ? 'New' : 'Active';

    header   = '<div>';
    header  += '<span class="col-md-12 float-left"><button type="button" class="btn btn-default btn-sm" onclick = "carousel_prev()"><span class="glyphicon glyphicon-menu-left"></span></button> Details</span>';
    header  += '<span class="float-right"><button type="button" class="btn btn-default btn-sm" id = "fav_button" onclick = "append_favourite(' + billIndex + ',' + billType + ')"><i class="fa fa-star-o" aria-hidden="true"></i></button></span>';
    header  += '</div>';

    billInfo  = '<table class="table">';
    billInfo += '<tr><td>Bill ID        </td> <td>' + jsonObj.bill_id.toUpperCase() + '</td></tr>';
    billInfo += '<tr><td>Title          </td> <td>' + jsonObj.official_title + '</td></tr>';
    billInfo += '<tr><td>Bill Type      </td> <td>' + jsonObj.bill_type.toUpperCase() + '</td></tr>';
    billInfo += '<tr><td>Sponsor        </td> <td>' + jsonObj.sponsor.title  + '. ' + jsonObj.sponsor.last_name + ', ' + jsonObj.sponsor.first_name + '</td></tr>';
    billInfo += '<tr><td>Chamber        </td> <td>' + jsonObj.chamber.toUpperCase() + '</td></tr>';
    billInfo += '<tr><td>Status         </td> <td>' + statusOfBill           + '</td></tr>';
    billInfo += '<tr><td>Introduced On  </td> <td>' + jsonObj.introduced_on  + '</td></tr>';
    billInfo += '<tr><td>Congress URL   </td> <td><a href = "' + jsonObj.urls.congress + '" target = "_blank"> URL </a></td></tr>';
    billInfo += '<tr><td>Version Status </td> <td>' + jsonObj.last_version.version_name + '</td></tr>';
    billInfo += '<tr><td>Bill URL       </td> <td><a href = "' + jsonObj.last_version.urls.pdf + '" target = "_blank"> Link </a></td></tr>';
    billInfo += '</table>';

    pdfObject = '<object data="' + jsonObj.last_version.urls.pdf + '" type="application/pdf" width="500px" height="500px"></object>';
    //pdfObject = '<embed src="' +  jsonObj.last_version.urls.pdf + '" width="500" height="375" type= "application/pdf">';

    dataToAppend = header + '<div class="col-md-6">' + billInfo + '</div>' + '<div class="col-md-6" id = "pdf_display">' + pdfObject + '</div>';


    document.getElementById('view_details').innerHTML = dataToAppend;

    carousel_next();

}

function get_fav_comm_data(srcIndexKey, IndexValue)
{
    var output          = "";
    var pureIndexValues = IndexValue.split('+');
    var jsonObj         = JSON.parse(JSON.parse(get_local_storage_data(srcIndexKey)));
    var favValue        = get_fav_value(srcIndexKey);

    for(var idxCount = 0; idxCount < pureIndexValues.length; ++idxCount)
    {
        var commJsonObj = jsonObj.results[Number(pureIndexValues[idxCount])];

        output += '<tr>';
        output += '<td>';
        output += '<button type="button" class="btn btn-default" onclick = "remove_fav(' + favValue + ',' +  Number(pureIndexValues[idxCount]) + ',' +  FAV_COM_TABLE + ',' +  fav_comm_table_remove_idx + ')"><i class="fa fa-trash" aria-hidden="true"></i></button>';
        output += '</td><td>';
        output += commJsonObj.chamber == "house" ? '<img class = \"img-auto\" src = \"./pics/house.jpg\">   House' : (commJsonObj.chamber == "senate" ? '<img class = \"img-auto\" src = \"./pics/senate.jpg\"> Senate' :  '<img class = \"img-auto\" src = \"./pics/senate.jpg\" Joint')
        output += '</td><td>';
        output += commJsonObj.committee_id.toUpperCase();
        output += '</td><td>';
        output += commJsonObj.name;
        output += '</td><td>';
        output += commJsonObj.parent_committee_id;
        output += '</td><td>';
        output += commJsonObj.subcommittee ? 'TRUE' : 'FALSE';
        output += '</td></tr>';

        fav_comm_table_remove_idx++;
    }

    return output;
}

function display_comm_fav ()
{
    var output           = "";
    var favHouseCommStr  = get_local_storage_data(FAV_COM_HOUSE);
    var favSenateCommStr = get_local_storage_data(FAV_COM_SENATE);
    var favJointCommStr  = get_local_storage_data(FAV_COM_JOINT);

    document.getElementById('display-header').innerHTML = '<h3>Committee</h3>';

    fav_comm_table_remove_idx = 0;

    output  = '<table id = "fav_com_table" class="table"><thead><tr><th></th><th>Chamber</th><th>Committee ID</th><th>Name</th><th>Parent Committee</th><th>Sub Committee</th></tr></thead>';
    output += '<tbody>';
    output += favHouseCommStr  == null || favHouseCommStr  == "" ? "" : get_fav_comm_data(COM_HOUSE,   favHouseCommStr);
    output += favSenateCommStr == null || favSenateCommStr == "" ? "" : get_fav_comm_data(COM_SENATE,  favSenateCommStr);
    output += favJointCommStr  == null || favJointCommStr  == "" ? "" : get_fav_comm_data(COM_JOINT,   favJointCommStr);
    output += '</tbody></table>';

    document.getElementById('display').innerHTML = output;
}

function display_comm(response)
{
    var output;
    var filterType = "";
    var jsonObj    = JSON.parse(JSON.parse(response));
    var numberOfRows = 0;

    store_local_storage_data(comm_type_needed, response);

    if(comm_type_needed == COM_HOUSE)
    {
        output     = '<table id = "id_comm_table" class="table"><thead><tr><th></th><th>Chamber</th><th>Committee ID</th><th>Name</th><th>Parent Committee</th><th>Contact</th><th>Office</th><th></th></tr></thead>';
        filterType = "house";
    }
    else
    if(comm_type_needed == COM_SENATE)
    {
        output     = '<table id = "id_comm_table" class="table"><thead><tr><th></th><th>Chamber</th><th>Committee ID</th><th>Name</th><th>Parent Committee</th><th></th></tr></thead>';
        filterType = "senate";
    }
    else
    {
        output     = '<table  id = "id_comm_table" class="table"><thead><tr><th></th><th>Chamber</th><th>Committee ID</th><th>Name</th><th></th></tr></thead>';
        filterType = "joint";
    }

    output += '<tbody>';

    for( var i = 0; i < jsonObj.results.length; ++i)
    {
        if(filterType == "house" && jsonObj.results[i].chamber == filterType)
        {
            output += '<tr>';
            output += '<td>';
            output += '<span class="float-right"><button type="button" class="btn btn-default btn-sm" id = "fav_button" onclick = "append_favourite(' + i + ',' + comm_type_needed + ')"><i class="fa fa-star-o" aria-hidden="true"></i></button></span>';
            output += '</td><td>';
            output += "<img class = \"img-auto\" src = \"./pics/house.jpg\">   House";
            output += '</td><td>';
            output += jsonObj.results[i].committee_id;
            output += '</td><td>';
            output += jsonObj.results[i].name;
            output += '</td><td>';
            output += (typeof jsonObj.results[i].parent_committee_id == "undefined" || jsonObj.results[i].parent_committee_id == null) ? "N.A." : jsonObj.results[i].parent_committee_id;
            output += '</td><td>';
            output += jsonObj.results[i].phone;
            output += '</td><td>';
            output += (typeof jsonObj.results[i].office == "undefined" || jsonObj.results[i].office == null) ? "N.A." : jsonObj.results[i].office;
            output += '</td></tr>';
            ++numberOfRows;
        }
        else
        if(filterType == "senate" && jsonObj.results[i].chamber == filterType)
        {
            output += '<tr>';
            output += '<td>';
            output += '<span class="float-right"><button type="button" class="btn btn-default btn-sm" id = "fav_button" onclick = "append_favourite(' + i + ',' + comm_type_needed + ')"><i class="fa fa-star-o" aria-hidden="true"></i></button></span>';
            output += '</td><td>';
            output += "<img class = \"img-auto\" src = \"./pics/senate.jpg\">   Senate";
            output += '</td><td>';
            output += jsonObj.results[i].committee_id;
            output += '</td><td>';
            output += jsonObj.results[i].name;
            output += '</td><td>';
            output += (typeof jsonObj.results[i].parent_committee_id == "undefined" || jsonObj.results[i].parent_committee_id == null) ? "N.A." : jsonObj.results[i].parent_committee_id;
            output += '</td></tr>';
            ++numberOfRows;
        }
        else
        if(filterType == "joint" && jsonObj.results[i].chamber == filterType)
        {
            output += '<tr>';
            output += '<td>';
            output += '<span class="float-right"><button type="button" class="btn btn-default btn-sm" id = "fav_button" onclick = "append_favourite(' + i + ',' + comm_type_needed + ')"><i class="fa fa-star-o" aria-hidden="true"></i></button></span>';
            output += '</td><td>';
            output += "<img class = \"img-auto\" src = \"./pics/senate.jpg\">   Joint";
            output += '</td><td>';
            output += jsonObj.results[i].committee_id;
            output += '</td><td>';
            output += jsonObj.results[i].name;
            output += '</td></tr>';
            ++numberOfRows;
        }
        else
        {
            ;
        }
    }

    output += '</tbody></table>';

    var paginatedDiv = '<nav aria-label="Page navigation"><ul class="pagination" id="pagination"></ul></nav>';

    document.getElementById('display').innerHTML = output + paginatedDiv;

    var obj = $('#pagination').twbsPagination({
        totalPages: Math.ceil(numberOfRows / 10),
        visiblePages: 6,
        onPageClick: function (event, page)
        {
            current_page_index = page;

            display_paginated_rows(page, 10, Math.ceil(numberOfRows / 10), 3);
        }
    });
}

function display_bills(response)
{
    var output;
    var jsonObj = JSON.parse(JSON.parse(response));
    var numberOfRows = 0;

    store_local_storage_data(bill_type_needed, response);

    if(bill_type_needed == ACTIVE_BILLS)
    {
        document.getElementById('display-header').innerHTML = '<h3>Active Bills</h3>';
    }
    else
    {
        document.getElementById('display-header').innerHTML = '<h3>New Bills</h3>';
    }

    output  = '<table id = "id_bill_type" class="table"><thead><tr><th>Bill ID</th><th>Bill Type</th><th>Title</th><th>Chamber</th><th>Introduced</th><th>Sponsor</th><th></th></tr></thead>';
    output += '<tbody>';

    for( var i = 0; i < jsonObj.results.length; ++i)
    {
        if(jsonObj.results[i].history.active == bill_type_needed)
        {
            output += '<tr>';
            output += '<td>';
            output += jsonObj.results[i].bill_id.toUpperCase();
            output += '</td><td>';
            output += jsonObj.results[i].bill_type.toUpperCase();
            output += '</td><td>';
            output += jsonObj.results[i].official_title;
            output += '</td><td>';
            output += jsonObj.results[i].chamber == 'senate' ? " <img class = \"img-auto\" src = \"./pics/senate.jpg\">  Senate" : "<img class = \"img-auto\" src = \"./pics/house.jpg\">   House";
            output += '</td><td>';
            output += jsonObj.results[i].introduced_on;
            output += '</td><td>';
            output += jsonObj.results[i].sponsor.last_name + ", " + jsonObj.results[i].sponsor.first_name;
            output += '</td><td>';
            output += '<button type="button" class="btn btn-primary"onclick="bill_view_details(' + i + ',' + bill_type_needed + ')">View Details</button>';
            output += '</td></tr>';

            ++numberOfRows;
        }
        else
        {
            /* Data is not same as expected one */;
        }
    }
    output += '</tbody></table>';
    var paginatedDiv = '<nav aria-label="Page navigation"><ul class="pagination" id="pagination"></ul></nav>';
    document.getElementById('display').innerHTML = output + paginatedDiv;

    var obj = $('#pagination').twbsPagination({
        totalPages: Math.ceil(numberOfRows / 10),
        visiblePages: 6,
        onPageClick: function (event, page)
        {
            current_page_index = page;

            display_paginated_rows(page, 10, Math.ceil(numberOfRows / 10), 2);
        }
    });
}

function display_result(response)
{
    var output;
    var paginatedDiv;
    var numberOfRows = 0;
    var jsonObj = JSON.parse(JSON.parse(response));

    store_local_storage_data(leg_type_needed, response);

    output  = '<table id = "id_leg_table" class="table"><thead><tr><th>Party</th><th>Name</th><th>Chamber</th><th>District</th><th>State</th><th></th></tr></thead>';
    output += '<tbody>';

    for( var i = 0; i < jsonObj.results.length; ++i)
    {
        output += '<tr>';
        output += '<td>';
        output += jsonObj.results[i].party == 'R' ? "<img class = \"img-auto\" src = \"./pics/republic.jpg\">" : "<img class = \"img-auto\" src = \"./pics/democrat.jpg\">"
        output += '</td><td>';
        output += jsonObj.results[i].last_name + ", " + jsonObj.results[i].first_name;
        output += '</td><td>';
        output += jsonObj.results[i].chamber == 'senate' ? " <img class = \"img-auto\" src = \"./pics/senate.jpg\">  Senate" : "<img class = \"img-auto\" src = \"./pics/house.jpg\">   House";
        output += '</td><td>';
        output += ((jsonObj.results[i].district == null) || (typeof jsonObj.results[i].district === "undefined")) ?  "N.A." : "District " + jsonObj.results[i].district;
        output += '</td><td>';
        output += jsonObj.results[i].state_name;
        output += '</td><td>';
        output += '<button type="button" class="btn btn-primary" onclick="leg_view_details(' + i + ',' + leg_type_needed + ')">View Details</button>';
        output += '</td></tr>';

        ++numberOfRows;
    }
    output += '</tbody></table>';

    paginatedDiv = '<nav aria-label="Page navigation"><ul class="pagination" id="pagination"></ul></nav>';

    document.getElementById('display').innerHTML = output + paginatedDiv;


    var obj = $('#pagination').twbsPagination({
        totalPages: Math.ceil(numberOfRows / 10),
        visiblePages: 6,
        onPageClick: function (event, page)
        {
            current_page_index = page;

            display_paginated_rows(page, 10, Math.ceil(numberOfRows / 10), 1);
        }
    });
}

function get_leg(legType)
{
    var reqType;

    if(legType == 1)
    {
        var dropdown = prepareDropDown();

        reqType = 'all_leg';

        leg_type_needed = LEG_BY_STATE;

        document.getElementById('display-header').innerHTML = '<div><h3>Legislators By State</h3>' +  dropdown + '</div>' ;
    }
    else
    if(legType == 2)
    {
        var searchBox = prepare_search_box();

        reqType = 'all_house';

        leg_type_needed = LEG_BY_HOUSE;

        document.getElementById('display-header').innerHTML = '<h3>Legislators By House</h3>' + searchBox;
    }
    else
    {
        var searchBox = prepare_search_box();

        reqType = 'all_senate';

        leg_type_needed = LEG_BY_SENATE;

        document.getElementById('display-header').innerHTML = '<h3>Legislators By Senate</h3>' + searchBox;
    }

    prepareUrl(reqType, display_result, leg_type_needed);
}


function get_Bills(billType)
{
    if(billType == 1)
    {
        bill_type_needed = ACTIVE_BILLS;
    }
    else
    {
        bill_type_needed = NEW_BILLS;
    }

    prepareUrl('all_bills', display_bills, bill_type_needed);
}

function get_committee (cType)
{
    if(cType == 1)
    {
        document.getElementById('display-header').innerHTML = '<h3>House</h3>';

        comm_type_needed = COM_HOUSE;
    }
    else
    if(cType == 2)
    {
        document.getElementById('display-header').innerHTML = '<h3>Senate</h3>';

        comm_type_needed = COM_SENATE;
    }
    else
    {
        document.getElementById('display-header').innerHTML = '<h3>Joint</h3>';

        comm_type_needed = COM_JOINT;
    }

    prepareUrl('all_committee', display_comm, comm_type_needed);
}


function change_page_tab (changeItem)
{
    var output;
    var display;

    display  = document.getElementById("page-tabs");

    switch (changeItem)
    {
        case 1:
        {
            output  = '<li class="active"><a data-toggle="tab" href="" onclick = "get_leg(1);return false;">By State</a></li>';
            output += '<li><a data-toggle="tab" href="" onclick = "get_leg(2);return false;">House</a></li>';
            output += '<li><a data-toggle="tab" href="" onclick = "get_leg(3);return false;">Senate</a></li>';

            get_leg(1);

            break;
        }

        case 2:
        {
            output  = '<li class="active"><a data-toggle="tab" href="" onclick = "get_Bills(1); return false;">Active Bills</a></li>';
            output += '<li>               <a data-toggle="tab" href="" onclick = "get_Bills(2); return false;">New Bills</a></li>';

            get_Bills(1);

            break;
        }

        case 3:
        {
            output  = '<li class="active"><a data-toggle="tab" href="" onclick = "get_committee(1); return false;">House</a></li>';
            output += '<li>               <a data-toggle="tab" href="" onclick = "get_committee(2); return false;">Senate</a></li>';
            output += '<li>               <a data-toggle="tab" href="" onclick = "get_committee(3); return false;">Joint</a></li>';

            get_committee(1);

            break;
        }

        case 4:
        {
            output  = '<li class="active"><a data-toggle="tab" href="" onclick = "display_leg_fav(); return false;">Legislators</a></li>';
            output += '<li><a data-toggle="tab" href="" onclick = "display_bill_fav(); return false;">Bills</a></li>';
            output += '<li><a data-toggle="tab" href="" onclick = "display_comm_fav(); return false;">Committees</a></li>';

            display_leg_fav();

            break;
        }
    }

    display.innerHTML = output;
}

function load_header (clickedItem)
{
    var display = document.getElementById("page-menubar");

    switch (clickedItem)
    {
        case 1:
        {
            display.innerHTML = "<h3> Legislators </h3>";

            change_page_tab(1);

            break;
        }
        case 2:
        {
            display.innerHTML = "<h3> Bills </h3>";

            change_page_tab(2);

            break;
        }
        case 3:
        {
            display.innerHTML = "<h3> Committees </h3>";

            change_page_tab(3);

            break;
        }
        case 4:
        {
            display.innerHTML = "<h3> Favorites </h3>";

            change_page_tab(4);

            break;
        }
    }
}

function displaynavbar ()
{
    var display = document.getElementById('header_navigation');

    if(header_nav_bar_active == 0)
    {
        var output;
        header_nav_bar_active = 1;

        output  = '<ul class = "nav nav-stacked navbar">';
        output += '<li onclick="load_header(1)"><a class = "fg-gray" href="javaScript:void(0);"><span class="glyphicon glyphicon-user">  </span>&nbsp;&nbsp;Legislators</a></li>';
        output += '<li onclick="load_header(2)"><a class = "fg-gray" href="javaScript:void(0);"><span class="glyphicon glyphicon-file">  </span>&nbsp;&nbsp;Bills      </a></li>';
        output += '<li onclick="load_header(3)"><a class = "fg-gray" href="javaScript:void(0);"><span class="glyphicon glyphicon-log-in"></span>&nbsp;&nbsp;Committees </a></li>';
        output += '<li onclick="load_header(4)"><a class = "fg-gray" href="javaScript:void(0);"><span class="glyphicon glyphicon-star">  </span>&nbsp;&nbsp;Favorites  </a></li>'
        output += '</ul>';

        display.innerHTML = output;
    }
    else
    {
        header_nav_bar_active = 0;

        display.innerHTML = "";
    }

}