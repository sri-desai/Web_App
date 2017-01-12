<?php
    $apiUrl = "";
    $requestedInfo = $_GET['option'];
    $bioId         = $_GET['bioId'];
    $apiKey = "d600685da0d148b3806d7eb148635223";

    if($requestedInfo == 'all_leg')
    {
        $apiUrl = "http://congress.api.sunlightfoundation.com/legislators?apikey=". $apiKey. "&per_page=all";
    }
    else
    if($requestedInfo == 'all_house')
    {
        $apiUrl = "http://congress.api.sunlightfoundation.com/legislators?chamber=house&apikey=". $apiKey;
    }
    else
    if($requestedInfo == 'all_senate')
    {
        $apiUrl = "http://congress.api.sunlightfoundation.com/legislators?chamber=senate&apikey=". $apiKey;
    }
    else
    if($requestedInfo == 'all_bills')
    {
        $apiUrl = "http://congress.api.sunlightfoundation.com/bills?apikey=". $apiKey. "&per_page=50";
    }
    else
    if($requestedInfo == 'all_committee')
    {
        $apiUrl = "http://congress.api.sunlightfoundation.com/committees?apikey=". $apiKey. "&per_page=all";
    }
    else
    if($requestedInfo == 'top_bill')
    {
        $apiUrl = "http://congress.api.sunlightfoundation.com/bills?apikey=". $apiKey. "&sponsor_id=". $bioId. "&per_page=5";
    }
    else
    if($requestedInfo == 'top_comm')
    {
        $apiUrl = "http://congress.api.sunlightfoundation.com/committees?apikey=". $apiKey. "&member_ids=". $bioId. "&per_page=5";
    }
    else
    {
        /* This case will not and should not exist */
        exit(1);
    }

    $jsonContents = file_get_contents($apiUrl);

    echo json_encode($jsonContents);
?>