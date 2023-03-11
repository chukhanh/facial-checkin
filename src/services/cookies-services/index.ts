import Cookies from 'js-cookie';

const CookiesServices = (() => {
  const _getCookies = (name: string): string => {
    return Cookies.get(name);
  };

  const _setCookies = (name: string, value: string | number): void => {
    if (name === 'token') {
      Cookies.set(name, `${value}`, { expires: 6 });
    } else Cookies.set(name, `${value}`);
  };

  const _clearCookies = (name: string): void => {
    Cookies.remove(name);
  };

  return {
    getCookies: _getCookies,
    setCookies: _setCookies,
    clearCookies: _clearCookies,
  };
})();

export default CookiesServices;
