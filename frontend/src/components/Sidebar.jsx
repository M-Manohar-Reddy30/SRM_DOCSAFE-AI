import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

export default function Sidebar() {
  const location =
    useLocation();

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/";
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: FileText,
    },
    {
      name: "AI Chat",
      path: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <aside
      className="
        w-72
        min-h-screen
        bg-white
        border-r
        border-slate-200
        flex
        flex-col
        justify-between
        shadow-sm
      "
    >
      {/* Top Section */}

      <div>

        {/* Logo */}

        <div className="px-8 pt-8 pb-10">

          <div className="flex items-center gap-3">

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-indigo-600
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <Sparkles
                className="text-white"
                size={22}
              />
            </div>

            <div>

              <h1
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                SrmDocSafe AI
              </h1>

              <p
                className="
                  text-slate-500
                  text-sm
                "
              >
                AI Workspace
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <nav className="px-4 space-y-2">

          {menuItems.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                location.pathname ===
                item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex
                    items-center
                    gap-4
                    px-4
                    py-4
                    rounded-2xl
                    transition-all
                    duration-300
                    ${
                      active
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }
                  `}
                >

                  <Icon size={20} />

                  <span className="font-medium">
                    {item.name}
                  </span>

                </Link>
              );
            }
          )}

        </nav>

      </div>

      {/* Bottom Section */}

      <div className="p-6">

        {/* User Card */}

        <div
          className="
            bg-slate-100
            rounded-3xl
            p-4
            mb-5
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-gradient-to-r
                from-violet-600
                to-indigo-600
                flex
                items-center
                justify-center
                text-white
                font-bold
              "
            >
              <User size={18} />
            </div>

            <div>

              <h4
                className="
                  font-semibold
                  text-slate-900
                "
              >
                Manohar Reddy
              </h4>

              <p
                className="
                  text-slate-500
                  text-sm
                "
              >
                AI Engineer
              </p>

            </div>

          </div>

        </div>

        {/* AI Banner */}

        <div
          className="
            bg-gradient-to-r
            from-violet-600
            to-indigo-600
            rounded-3xl
            p-5
            mb-5
            text-white
            shadow-xl
          "
        >

          <p className="text-sm opacity-90">
            AI Assistant Ready
          </p>

          <h3 className="font-bold text-lg mt-1">
            Smart Document Intelligence
          </h3>

        </div>

        {/* Logout */}

        <button
          onClick={logout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            bg-red-500
            hover:bg-red-600
            transition-all
            duration-300
            text-white
            font-semibold
            py-4
            rounded-2xl
            shadow-lg
          "
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}