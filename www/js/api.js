const API_BASE_URL = "http://10.0.2.2:3000/api";

async function apiRequest(endpoint, options = {}) {

    const token = localStorage.getItem("auth_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // Use Cordova's native HTTP plugin
    if (window.cordova && window.cordova.plugin && window.cordova.plugin.http) {

        return new Promise((resolve, reject) => {

            window.cordova.plugin.http.setDataSerializer("json");

            window.cordova.plugin.http.sendRequest(
                `${API_BASE_URL}${endpoint}`,
                {
                    method: options.method || "GET",
                    headers: headers,
                    data: options.body
                        ? JSON.parse(options.body)
                        : {}
                },
                response => {

                    let data = {};

                    try {
                        data = JSON.parse(response.data);
                    } catch (error) {
                        data = {
                            message: response.data
                        };
                    }

                    if (response.status < 200 || response.status >= 300) {
                        reject(
                            new Error(
                                data.message || "An API error occurred."
                            )
                        );
                        return;
                    }

                    resolve(data);
                },
                response => {

                    let data = {};

                    try {
                        data = JSON.parse(response.error);
                    } catch (error) {
                        data = {
                            message: response.error
                        };
                    }

                    reject(
                        new Error(
                            data.message || "Unable to connect to the server."
                        )
                    );
                }
            );
        });
    }

    // Fallback to fetch for browser testing
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "An API error occurred."
        );
    }

    return data;
}