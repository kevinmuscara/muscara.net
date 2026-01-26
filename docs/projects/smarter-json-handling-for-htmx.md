# Smarter JSON Handling for HTMX

While exploring the possibilities of [HTMX](https://htmx.org) in projects, I faced the realization that some APIs needed for projects are not built to meet the standard of a hypermedia system. HTMX expects HTML fragments by default, handling JSON responses often means writing extra JavaScript just to massage that data into DOM updates, which goes against the spirit of HTMX's simplicity.

This lead to the creation of [htmx-jsonata](https://www.npmjs.com/package/@muscara/htmx-jsonata). A tool that brings the power of [JSONata](https://jsonata.org/) into workflows, letting you declaratively transform and bind data without sprawling client side code.

## What is it?

JSONata is designed for querying and reshaping JSON responses with powerful expressions. HTMX traditionally works best with HTML over the wire. A server provides HTML partials that are preprocessed and directly swapped into the DOM. There are other htmx-json extensions, but none include expression based transformation out of the box.

This tool serves as the first library that provides JSON responses a declarative way to drive DOM updates.

## Why is it needed?

This tool fills my developer needs for the following reasons:

1. **Keeping logic out of HTML templates**: instead of manually writing DOM updates in JavaScript, I can transform the data structure to only whats needed.

2. **Non hypermedia systems**: APIs not following hypermedia principals will still return JSON, this library allows those APIs to still be used in HTMX.

## How it works

I won't go into a deep dive, but the typical pattern is as follows:

1. **Issue a GET request** that expects a JSON response.
2. **Apply a JSONata expression** to the JSON response to transform the data.
3. **Update the DOM** based on the transformed result by binding values to elements.

Before `htmx-jsonata`:

```HTML
<h1 id="title"></h1>
<p id="status"></p>

<script>
  // Make the GET request
  fetch("/api/v2/summary.json").then(res => res.json()).then(data => {
    // Extract what you need from the data
    let specialPrograms = data.components.filter(resource => resource.title == 'Special Programs');
    let { name, status } = specialPrograms;

    document.querySelector("#title").textContent = name;
    document.querySelector("#count").textContent = status;
  });
</script>
```

After `htmx-jsonata`:

```HTML
<div jn-url="/api/v2/summary.json" jn-query="components[name='Special Programs']">
  <h1>${name}</h1>
  <p>${status}</p>
</div>
```

As you can see, there is a massive difference in having to process data and format it using JavaScript.

## Benefits

- **Less JS**: more logic driven by delcarative JSONata expressions.
- **Reusability**: JSONata expressions are reusable across endpoints and templates.
- **Separateion**: Backend returns data, frontend declares how to render it.

As web apps lean toward microservices, tools like HTMX and JSONata let you modernize UI, update flows without adopting a heavy frontend framework. Your backend can stay API centric, while the frontend remains lightweight, declarative, and HTML centric.

If you're building with HTMX and find yourself wrestling with JSON responses, this gives you a new pattern to drive dynamic UIs. 

## Try it out

Try it out yourself using the [live playground](https://htmx-jsonata.muscara.net)