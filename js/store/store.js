// Simple State Management System
class Store {
    constructor() {
        this.state = {};
        this.subscribers = new Map();
        this.reducers = new Map();
    }

    // Initialize state
    initState(initialState) {
        this.state = { ...initialState };
        this.notifySubscribers();
    }

    // Get current state
    getState() {
        return { ...this.state };
    }

    // Subscribe to state changes
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.subscribers.get(key);
            if (callbacks) {
                callbacks.delete(callback);
                if (callbacks.size === 0) {
                    this.subscribers.delete(key);
                }
            }
        };
    }

    // Register reducer
    registerReducer(key, reducer) {
        this.reducers.set(key, reducer);
    }

    // Dispatch action
    dispatch(action) {
        const { type, payload } = action;
        const [stateKey] = type.split('/');
        
        const reducer = this.reducers.get(stateKey);
        if (!reducer) {
            console.warn(`No reducer registered for key: ${stateKey}`);
            return;
        }

        const currentState = this.state[stateKey];
        const newState = reducer(currentState, action);

        if (newState !== currentState) {
            this.state = {
                ...this.state,
                [stateKey]: newState
            };
            this.notifySubscribers(stateKey);
        }
    }

    // Notify subscribers of state changes
    notifySubscribers(key = null) {
        if (key) {
            const callbacks = this.subscribers.get(key);
            if (callbacks) {
                callbacks.forEach(callback => callback(this.state[key]));
            }
        } else {
            this.subscribers.forEach((callbacks, key) => {
                callbacks.forEach(callback => callback(this.state[key]));
            });
        }
    }

    // Create selector
    createSelector(key, selectorFn) {
        return () => selectorFn(this.state[key]);
    }

    // Async action handler
    async dispatchAsync(actionCreator) {
        try {
            const action = await actionCreator(this.dispatch.bind(this), this.getState.bind(this));
            if (action) {
                this.dispatch(action);
            }
        } catch (error) {
            console.error('Async action error:', error);
            this.dispatch({
                type: 'error/set',
                payload: error.message
            });
        }
    }
}

// Create store instance
const store = new Store();

// Register initial reducers
store.registerReducer('auth', (state = { user: null, isAuthenticated: false }, action) => {
    switch (action.type) {
        case 'auth/login':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true
            };
        case 'auth/logout':
            return {
                ...state,
                user: null,
                isAuthenticated: false
            };
        default:
            return state;
    }
});

store.registerReducer('ui', (state = { theme: 'light', loading: false }, action) => {
    switch (action.type) {
        case 'ui/setTheme':
            return {
                ...state,
                theme: action.payload
            };
        case 'ui/setLoading':
            return {
                ...state,
                loading: action.payload
            };
        default:
            return state;
    }
});

// Initialize store with default state
store.initState({
    auth: {
        user: null,
        isAuthenticated: false
    },
    ui: {
        theme: 'light',
        loading: false
    }
});

export default store;
