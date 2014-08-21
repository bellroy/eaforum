# Effective Altruism Forum

## Migrating data

The Effective Altruism forum has been migrated from a WordPress site into a fork of LessWrong. In order to migrate the data effectively a number of steps need to be followed. 

1. Get a WordPress export of the whole site. The migration process wipes all existing articles and comments so it is important that the export file contains a full list of articles and comments.
2. CD to the _scripts_ directory and run the wordpress_xml_to_yml.rb script, using the following syntax. This script creates a YML file that is ready for import into the LessWrong format. This is done as an intermediate step so that existing import code can be reused.

    ```
    ruby wordpress_xml_to_yml.rb wordpress-export.xml ready-to-import-format.yml
    ```
3. Some small modifications to the existing Python code need to be made so that the migration runs without error. There are two instances in the _r2/r2/models/link.py_ file where the cache is invalidated when an article or comment is added. This code relies on a HTTP request being made in order to run correctly, but we're not going to be using HTTP requests to create articles or comments, so the code will break. Find the _should_invalidate_ flag in the code and comment out the following block (it appears twice).

    ```
    if should_invalidate:
        g.rendercache.delete('side-comments' + '-' + c.site.name)
        tags = Link._byID(self.link_id, data = True).tag_names()
        if 'open_thread' in tags:
            g.rendercache.delete('side-open' + '-' + c.site.name)
        if 'quotes' in tags:
            g.rendercache.delete('side-quote' + '-' + c.site.name)
        if 'group_rationality_diary' in tags:
            g.rendercache.delete('side-diary' + '-' + c.site.name)
    ```
4. CD to the _r2_ directory, and run the _ob_import_run.py_ script to perform the actual import. Adjust the INI file according to the environment you're running in.

    ```
    paster run development.ini ../scripts/ob_import_run.py -c "import_posts('../scripts/ready-to-import-format.yml','../scripts/updated-permalinks.yml','main')"
    ```