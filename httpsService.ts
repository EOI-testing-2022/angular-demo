const apiToken = '::tokenMocked::';

const manageResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        throw response;
    }
    return response.json();
};

interface IHeaders {
  [key: string]: string;
}

class HttpService {
    headers: IHeaders = { 'Content-Type': 'application/json' };

    setGlobalHeaders(headers: IHeaders) {
        this.headers = { ...this.headers, ...headers };
    }

    setTokenAuthorizationHeader = () => {
        const getAllCookies = (): Record<string, string> => document.cookie
            .split(';')
            .reduce((ac, str) => Object.assign(ac, { [str.split('=')[0].trim()]: str.split('=')[1] }), {});
        const { __px_uidtk: token } = getAllCookies();
        this.setGlobalHeaders({
            'x-api-key': apiToken as string,
        });
        if (token) {
            this.setGlobalHeaders({
                Authorization: `Bearer ${token}`,
            });
        }
    };

    async get<T>(endpoint: string, params?: Record<string, string>, headers = {}): Promise<T> {
        this.setTokenAuthorizationHeader();
        const urlParams = params
            ? (`?${new URLSearchParams(params)}`)
            : '';
        const url = `${endpoint}${urlParams}`;
        const response = await fetch(url, {
            headers: {
                ...this.headers,
                ...headers,
            },
        });

        return manageResponse(response);
    }

    async post<T>(endpoint: string, data = {}, headers = {}): Promise<T> {
        this.setTokenAuthorizationHeader();

        const response = await fetch(`${endpoint}`, {
            method: 'POST',
            headers: {
                ...this.headers,
                ...headers,
            },
            body: JSON.stringify(data),
        });

        return manageResponse<T>(response);
    }

    async put<T>(endpoint: string, data = {}, headers = {}): Promise<T | any> {
        this.setTokenAuthorizationHeader();

        const response = await fetch(`${endpoint}`, {
            method: 'PUT',
            headers: {
                ...this.headers,
                ...headers,
            },
            body: JSON.stringify(data),
        });

        return manageResponse(response);
    }

    async patch<T>(endpoint: string, data = {}, headers = {}): Promise<T | any> {
        this.setTokenAuthorizationHeader();
        const response = await fetch(`${endpoint}`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
                ...headers,
            },
            body: JSON.stringify(data),
        });

        return manageResponse(response);
    }

    async delete<T>(endpoint: string, data = {}, headers = {}): Promise<T | any> {
        this.setTokenAuthorizationHeader();

        const response = await fetch(`${endpoint}`, {
            method: 'DELETE',
            headers: {
                ...this.headers,
                ...headers,
            },
            body: JSON.stringify(data),
        });

        return manageResponse(response);
    }
}

export const httpService = new HttpService();