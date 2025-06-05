'use client';

import Dashboard from '../components/Dashboard/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
export default function Riscos() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#132536] pt-10 pl-10 pr-10 lg:pl-20 lg:pr-20 md:pl-15 md:pr-15">
                <div className="flex flex-col items-left justify-center">
                    <h1 className="text-2xl font-semibold text-left text-[#F5FAFF] pb-8">Dashboard de riscos</h1>
                    <div className="w-full flex items-center justify-center">
                        <Dashboard />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
