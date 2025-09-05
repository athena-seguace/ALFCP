import { Link, useLocation } from "react-router-dom";
import "./navBar.component.css";

const NavBarComponent = () => {
    const location = useLocation();

    const navItems = [
        { name: "Home", path: "/home" },
        { name: "Simulate", path: "/simulate" },
        { name: "Analyze", path: "/analyze" },
        { name: "Learn", path: "/learn" },
    ];

    return (
        <nav className="fixed min-w-125 h-10 top-4 left-1/2 transform -translate-x-1/2 z-50 bg-surface rounded-md px-6">
            <div className="h-full flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-xl text-t-primary site-name-background">
                        ALFCP
                    </h1>
                </div>
                <div className="flex items-center gap-5">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`text-t-secondary hover:text-t-primary ${
                                location.pathname === item.path
                                    ? "font-semibold underline"
                                    : null
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default NavBarComponent;
