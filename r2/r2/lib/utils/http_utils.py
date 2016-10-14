import pytz
import urllib
import urlparse
from datetime import datetime
import re

DATE_RFC822 = '%a, %d %b %Y %H:%M:%S %Z'
DATE_RFC850 = '%A, %d-%b-%y %H:%M:%S %Z'
DATE_ANSI = '%a %b %d %H:%M:%S %Y'

def read_http_date(date_str):
    try:
        date = datetime.strptime(date_str, DATE_RFC822)
    except ValueError:
        try:
            date = datetime.strptime(date_str, DATE_RFC850)
        except ValueError:
            try:
                date = datetime.strptime(date_str, DATE_ANSI)
            except ValueError:
                return None
    date = date.replace(tzinfo = pytz.timezone('GMT'))
    return date

def http_date_str(date):
    date = date.astimezone(pytz.timezone('GMT'))
    return date.strftime(DATE_RFC822)

# From http://stackoverflow.com/a/12897375:
def set_query_parameter(url, param_name, param_value):
    scheme, netloc, path, query_string, fragment = urlparse.urlsplit(url)
    query_params = urlparse.parse_qs(query_string)

    query_params[param_name] = [param_value]
    new_query_string = urllib.urlencode(query_params, doseq=True)

    return urlparse.urlunsplit((scheme, netloc, path, new_query_string, fragment))

def generate_comment_url(url, fullname):
    """
    If URL is for a comment, replace the path to the comment permalink
    with the path to the post, and add a fragment identifier to scroll
    to the comment.

    It would be better to get the post URL in a more-direct manner and
    use a helper to append the hash for the comment.
    """
    regex_string = """
        ^
        /ea
        /(?P<post_id>[^/]+)
        /(?P<post_slug>[^/]+)
        /(?P<comment_id>[^/]+)
        /?
        $
    """
    regex = re.compile(regex_string, re.VERBOSE)
    match = regex.match(url)
    if match and match.group('comment_id'):
        groupdict = match.groupdict()
        groupdict['fullname'] = fullname
        return '/ea/{post_id}/{post_slug}/#thingrow_{fullname}'.format(**groupdict)
    else:
        return url
