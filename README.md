# Image Abstraction Layer Using Imgur API

Built with Node.js, Express, and MongoDB

## Overview

The image abstraction layer uses the imgur API to return a variable array of objects containing image title, topic, alt text, and URL. Alternatively, the API can return the ten most recent search queries.

## Usage

- Return a list of image objects with a GET request to: "/api/imagesearch/<Search Term>"
- Paginate results with a GET request to: "/api/imagesearch/<Search Term>?offset=<Number>"
- Return list of ten recent searches with a GET request to: "/api/latest/imagesearch"

## Examples

GET => "/api/imagesearch/cats?offset=2" :

```
[
    {
        title: "Everyone deserves to see cats in ties today",
        topic: "Aww",
        description: null,
        url: "http://imgur.com/a/KaYI1"
    },
    {
        title: "Scotch & Cats",
        topic: "No Topic",
        description: null,
        url: "http://imgur.com/a/37oSL"
    }
]
```
GET => "/api/latest/imagesearch/" :
```
[
    {
        term: "cats",
        date: "2016-04-25T02:10:24.813Z"
    },
    {
        term: "ninjas",
        date: "2016-04-25T02:03:42.404Z"
    }
    
    ...
    
]
```

## Notes

- Search queries expire after seven days
