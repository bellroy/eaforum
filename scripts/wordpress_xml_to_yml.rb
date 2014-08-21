# encoding: utf-8

require 'nokogiri'
require 'yaml'
require 'time'

class WordPressXmlToYml

  def run(input_path, posts_output_path)
    xml = load_xml(input_path)

    authors_hash = build_author_hash(xml)
    posts_array = build_posts_array(xml, authors_hash)

    write_yml_file(posts_output_path, posts_array)
  end

  private

  def load_xml(input_path)
    File.open(input_path, "r") do |input_file|
      Nokogiri::XML(input_file)
    end
  end

  def write_yml_file(output_path, thing)
    File.open(output_path, "w") do |output_file|
      output_file.write thing.to_yaml
    end
  end

  def build_author_hash(xml)
    author_hash = {}

    author_nodes = xml.xpath("//channel/wp:author")
    author_nodes.each do |author_node|
      display_name =author_node.xpath("wp:author_display_name").first.content
      email = author_node.xpath("wp:author_email").first.content
      author_hash[display_name] = email
    end
    author_hash
  end

  def build_comments_array(post_node)
    comments_array = []
    post_node.xpath("wp:comment").each do |comment_node|
      timeStr = comment_node.xpath("wp:comment_date").first.content
      time = Time.strptime(timeStr, "%Y-%m-%d %H:%M:%S")
      comments_array << {
        "author" => comment_node.xpath("wp:comment_author").first.content.clean_author,
        "authorEmail" => comment_node.xpath("wp:comment_author_email").first.content,
        "authorUrl" => comment_node.xpath("wp:comment_author_url").first.content,
        "commentId" => comment_node.xpath("wp:comment_id").first.content.to_i,
        "commentParent" => comment_node.xpath("wp:comment_parent").first.content,
        "body" => comment_node.xpath("wp:comment_content").first.content.clean_html,
        "dateCreated" => time.strftime("%m/%d/%Y %I:%M:%S %p"),
        "postId" => post_node.xpath("wp:post_id").first.content.to_i
      }
    end
    comments_array
  end

  def build_posts_array(xml, authors_hash)
    post_array = []

    post_nodes = xml.xpath("//channel/item")
    post_nodes.each do |post_node|
      post_type = post_node.xpath("wp:post_type").first.content
      if post_type == "post"
        author = post_node.xpath("dc:creator").first.content
        category_node = post_node.xpath("category[@domain='category']").first
        category = category_node.content if category_node
        comments = build_comments_array(post_node)

        id = post_node.xpath("wp:post_id").first.content.to_i
        date_str = post_node.xpath("wp:post_date").first.content
        date_created = Time.strptime(date_str, "%Y-%m-%d %H:%M:%S")
        content = post_node.xpath("content:encoded").first.content
        link = post_node.xpath("link").first.content
        title = post_node.xpath("title").first.content
        post_array << {
          "author" => author.clean_author,
          "authorEmail" => authors_hash[author],
          "category" => [category],
          "comments" => comments,
          "dateCreated" => date_created.strftime("%m/%d/%Y %I:%M:%S %p"),
          "description" => content.clean_html,
          "mt_keywords" => "",
          "mt_text_more" => "",
          "permalink" => link,
          "postid" => id,
          "status" => "Publish",
          "title" => title.clean_html
        }
      end
    end
    post_array
  end
end

class String
  def clean_html
    if self.include?("\n\n") && !self.include?("<p>")
      "<p>" + self.gsub("\n\n", "</p><p>") + "</p>"
    else
      self#.gsub("\n", "").gsub("\r", "").gsub('—', "&mdash;").gsub("“", "&ldquo;")
      #   .gsub("‘", "&lsquo;").gsub("”", "&rdquo;").gsub("’", "&rsquo;")
      #   .gsub("…", "&hellip;").gsub("–", "&ndash;").gsub("″", "&Prime;")
    end
  end

  def clean_title
    self#.gsub("\n", "").gsub("\r", "").gsub('—', "-").gsub("“", "-")
      #.gsub("‘", "'").gsub("”", "\"").gsub("’", "''")
      #.gsub("…", "&hellip;").gsub("–", "&ndash;").gsub("″", "&Prime;")
  end

  def clean_author
    self.gsub('—', "-").gsub("“", "-").gsub("’", "'")
      .gsub("‘", "'").gsub("”", "\"").gsub("’", "'").gsub("ö", "oe")
  end
end

# First argument input file, second argument output file
if ARGV.length > 1 && File.exists?(ARGV[0])
  converter = WordPressXmlToYml.new
  converter.run(ARGV[0], ARGV[1])
else
  puts "Usage: wordpress_xml_to_yml.rb /path/to/input.xml /path/to/posts_output.yml"
end