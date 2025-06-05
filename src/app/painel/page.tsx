'use client'

import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

export default function Painel() {
    return (
        <ProtectedRoute>
            <div>
                {/* Your protected content here */}
            </div>
        </ProtectedRoute>
    )
}
