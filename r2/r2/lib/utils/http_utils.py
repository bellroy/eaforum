import pytz
import urllib
import urlparse
from datetime import datetime

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
