import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [adminData, setAdminData] = useState(null);

    return (
        <AdminContext.Provider value={{ adminData, setAdminData }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminContext = () => useContext(AdminContext);
