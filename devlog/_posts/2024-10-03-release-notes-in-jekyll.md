Our team uses [GitHub pages](https://docs.github.com/en/pages/quickstart) with [Jekyll](https://jekyllrb.com) to publish release notes. Our prior setup was using a basic Jekyll theme, but I thought to take it upon myself to update the theme to make the pages more friendly.

*In the screenshot below, you can see the new version of our GitHub page. The release notes are appended on to one page.*
<img alt="GitHub pages Jekyll site with JustTheDocs theme showing release notes" src="/assets/img/Screenshot-JustTheDocsJekyllThemeReleaseNotes.png" width="100%" />
[JustTheDocs](https://github.com/just-the-docs/just-the-docs) Jekyll theme used

As well as the visual changes, I also updated the way release note index files are generated on our site. Before any changes, adding a new release note required you to:
 1. Add a new markdown file,
 2. Paste the release notes, 
 3. Edit in the release date into the contents (not consistent format),
 4. Update the index page for the app, 
 5. Update the index page for the homepage,
 6. Push the changes to the GitHub repo.

Now we just need to: 
 1. Add a new markdown file, prefixed with the release date and suffixed with the version number, 
 2. Paste the release notes into the markdown file, 
 3. Push the changes to the GitHub repo.

The release notes are now generated into one file, as opposed to a different page for each release note. The release note markdown files now use the [Posts](https://jekyllrb.com/docs/posts/) folder structure, which takes advantage of the naming format.

```
/*/_posts/YEAR-MONTH-DAY-semanticversion.md
```

So in practice, the folders look like this...
```
./docs/releasenotes/myapp/index.md
./docs/releasenotes/myapp/_posts/2024-01-01-1.0.0.md
./docs/releasenotes/myapp/_posts/2024-02-01-1.1.0.md
./docs/releasenotes/myapp/_posts/2024-03-01-1.1.1.md
./docs/releasenotes/anotherapp/index.md
./docs/releasenotes/anotherapp/_posts/2024-01-01-1.0.0.md
./docs/releasenotes/anotherapp/_posts/2024-02-01-1.1.0.md
./docs/releasenotes/anotherapp/_posts/2024-03-01-1.1.1.md
```

This means there is no need to enter the release date into the Front Matter or the contents of the markdown. And the YEAR-MONTH-DAY name prefix works well for lexical sorting, which is an added bonus.

To generate the list of posts into one markdown file, I used Liquid to loop through the category of 'releasenotes', where it also contained the category of the app name (1).

You can also get the release date and version from the post name format used above (2).

{% raw %}
```markdown
<!-- Release notes list is auto generated from posts -->

# Release notes
{: .no_toc }

<details closed markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
1. TOC
{:toc}
</details>

{% assign _app = include.app | downcase | remove: "-" | remove: "_" -%}
<!-- (1) Select the list of posts with the category 'realeasenotes' and '{appname}'-->
{% assign releases = site.categories.releasenotes | where: "categories", _app -%}
{% for release in releases -%}

---
<!-- (2) 'release.title' comes from the file title suffix -->
## {{ release.title | downcase }} {% if release == releases.first %}<span class="label label-green">Latest</span>{% endif %}
<!-- (2) 'release.date' comes from the file date prefix -->
<small>{{ release.date | date: "%a, %b %d, %y" }}</small>
{% assign idprefix = 'id="' | append: release.title | append: "-" | downcase | remove: "." -%}
{{ release.content | replace: 'id="', idprefix }}

{%- endfor -%}
```
{% endraw %}


You can find the release notes pages on the [ShelterBox application development](https://shelterbox.github.io/docs/apps/) site. Thanks for reading!

