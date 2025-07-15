import axios from 'axios';

// Token cho authorization
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWRlbnRpZmllciI6IjEiLCJlbWFpbCI6ImFkbWluQGhvc3RuYW1lLmNvbSIsImZ1bGxOYW1lIjoiU3VwZXIgVXNlciIsIm5hbWUiOiJTdXBlciIsInN1cm5hbWUiOiJVc2VyIiwiaXBBZGRyZXNzIjoiMC4wLjAuMSIsImF2YXRhclVybCI6IiIsIm1vYmlsZXBob25lIjoiIiwiZXhwIjoxNzgxMjcwNDgzLCJpc3MiOiJodHRwczovL0JFLlNFUDQ5MC5uZXQiLCJhdWQiOiJCRS5TRVA0OTAifQ.kQIX9uvjN9UOPiBitp9JsO2DlPlFyIU4VTP1ZyM4k3Y";

// Cấu hình axios
const api = axios.create({
    baseURL: 'https://localhost:8175/api/v1',
    headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

// Sample data for development
const sampleHospitals = [
    {
        id: 1,
        name: "City General Hospital",
        code: "CGH001",
        type: "General",
        status: "active",
        address: "123 Main Street, Downtown",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        phoneNumber: "+1-555-0123",
        email: "info@citygeneral.com",
        website: "https://citygeneral.com",
        establishedDate: "1985-03-15",
        licenseNumber: "LIC-2024-001",
        totalBeds: 450,
        totalDepartments: 12,
        totalStaff: 850,
        rating: 4.8,
        accreditation: "Joint Commission",
        adminName: "Dr. Sarah Johnson",
        adminEmail: "admin@citygeneral.com",
        logoUrl: "",
        description: "A leading healthcare facility providing comprehensive medical services to the community.",
        services: ["Emergency Care", "Surgery", "Cardiology", "Pediatrics", "Oncology"],
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-06-10T14:30:00Z"
    },
    {
        id: 2,
        name: "Metropolitan Medical Center",
        code: "MMC002",
        type: "Specialized",
        status: "active",
        address: "456 Healthcare Blvd, Medical District",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA",
        phoneNumber: "+1-555-0456",
        email: "contact@metromedical.com",
        website: "https://metromedical.com",
        establishedDate: "1992-08-22",
        licenseNumber: "LIC-2024-002",
        totalBeds: 680,
        totalDepartments: 18,
        totalStaff: 1200,
        rating: 4.9,
        accreditation: "AAAHC",
        adminName: "Dr. Michael Chen",
        adminEmail: "admin@metromedical.com",
        logoUrl: "",
        description: "Advanced medical center specializing in cutting-edge treatments and research.",
        services: ["Neurology", "Cardiothoracic Surgery", "Transplant Services", "Cancer Treatment"],
        createdAt: "2024-02-01T10:00:00Z",
        updatedAt: "2024-06-08T16:45:00Z"
    },
    {
        id: 3,
        name: "Community Health Hospital",
        code: "CHH003",
        type: "Community",
        status: "inactive",
        address: "789 Community Ave, Suburbia",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
        phoneNumber: "+1-555-0789",
        email: "info@communityhealth.com",
        website: "https://communityhealth.com",
        establishedDate: "1978-11-05",
        licenseNumber: "LIC-2024-003",
        totalBeds: 200,
        totalDepartments: 8,
        totalStaff: 350,
        rating: 4.2,
        accreditation: "Joint Commission",
        adminName: "Dr. Emily Rodriguez",
        adminEmail: "admin@communityhealth.com",
        logoUrl: "",
        description: "Community-focused hospital providing accessible healthcare services to local residents.",
        services: ["Family Medicine", "Emergency Care", "Maternity", "Orthopedics"],
        createdAt: "2024-03-10T09:15:00Z",
        updatedAt: "2024-05-20T11:20:00Z"
    }
];

// Get all hospitals
export const getAllHospitals = async (params = {}) => {
    try {
        if (process.env.NODE_ENV === 'development') {
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredHospitals = [...sampleHospitals];

            // Filter by search
            if (params.search) {
                const searchLower = params.search.toLowerCase();
                filteredHospitals = filteredHospitals.filter(hospital =>
                    hospital.name.toLowerCase().includes(searchLower) ||
                    hospital.code.toLowerCase().includes(searchLower) ||
                    hospital.city.toLowerCase().includes(searchLower) ||
                    hospital.adminName.toLowerCase().includes(searchLower)
                );
            }

            // Filter by status
            if (params.status && params.status !== 'all') {
                filteredHospitals = filteredHospitals.filter(hospital => hospital.status === params.status);
            }

            // Filter by type
            if (params.type && params.type !== 'all') {
                filteredHospitals = filteredHospitals.filter(hospital => hospital.type === params.type);
            }

            return {
                items: filteredHospitals,
                total: filteredHospitals.length,
                page: params.page || 1,
                pageSize: params.pageSize || 10
            };
        }

        const response = await api.get('/hospital', { params });
        return {
            items: response.data || [],
            total: response.data?.length || 0,
            page: params.page || 1,
            pageSize: params.pageSize || 10
        };
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        return null;
    }
};

// Get hospital by ID
export const getHospitalById = async (id) => {
    try {
        if (process.env.NODE_ENV === 'development') {
            await new Promise(resolve => setTimeout(resolve, 300));
            return sampleHospitals.find(hospital => hospital.id === parseInt(id));
        }

        const response = await api.get(`/hospital/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching hospital ${id}:`, error);
        throw error;
    }
};

// Create hospital
export const createHospital = async (hospitalData) => {
    try {
        if (process.env.NODE_ENV === 'development') {
            await new Promise(resolve => setTimeout(resolve, 700));
            const newHospital = {
                ...hospitalData,
                id: sampleHospitals.length + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            return newHospital;
        }

        const response = await api.post('/hospital/create', hospitalData);
        return response.data;
    } catch (error) {
        console.error('Error creating hospital:', error);
        throw error;
    }
};

// Update hospital
export const updateHospital = async (id, hospitalData) => {
    try {
        if (process.env.NODE_ENV === 'development') {
            await new Promise(resolve => setTimeout(resolve, 600));
            const updatedHospital = {
                ...hospitalData,
                id,
                updatedAt: new Date().toISOString()
            };
            return updatedHospital;
        }

        const dataWithId = { ...hospitalData, id };
        const response = await api.put('/hospital/update', dataWithId);
        return response.data;
    } catch (error) {
        console.error(`Error updating hospital ${id}:`, error);
        throw error;
    }
};

// Delete hospital
export const deleteHospital = async (id) => {
    try {
        if (process.env.NODE_ENV === 'development') {
            await new Promise(resolve => setTimeout(resolve, 800));
            return true;
        }

        const response = await api.delete(`/hospital/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting hospital ${id}:`, error);
        return null;
    }
};