import Membros from '../components/Membros/Membros';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

export default function Integrantes() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#132536] pt-10 pl-10 pr-10 lg:pl-20 lg:pr-20 md:pl-15 md:pr-15">
                <h1 className="font-semibold text-2xl text-[#F5FAFF]">Integrantes - TDSPS</h1>
                <Membros />
            </div>
        </ProtectedRoute>
    )
}