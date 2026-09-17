import { LucideLogOut, X } from "lucide-react";
import SideLink from "../constants/SideLinks";
import { useNavigate } from "react-router-dom";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Sidebar({ role, isOpen, onClose }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed gap-4 left-0 top-0 z-50
          flex h-screen w-64 flex-col
          border-r bg-white p-5 shadow-md
          transition-transform duration-300 ease-in-out

          lg:translate-x-0

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-ls font-semibold">Leave Mgms</h3>

<<<<<<< Updated upstream
            <p className="text-sm text-muted-foreground">Leave Management System</p>
=======
            <p className="text-xs text-muted-foreground">
              Leave Management System
            </p>
>>>>>>> Stashed changes
          </div>

          {/* Close button - mobile only */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <Field>
          <ButtonGroup>
            <Input
              id="input-button-group"
              placeholder="Type to search..."
              className="px-3 text-sm"
            />
            <Button>
              <Search />
            </Button>
          </ButtonGroup>
        </Field>

        {/* Navigation */}
        <div className="flex-1">
          <SideLink role={role} onNavigate={onClose} />
        </div>

        {/* Logout */}
        <div className="border-t pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span>Logout</span>

            <LucideLogOut
              size={16}
              className="transition-colors text-red-500"
            />
          </button>
        </div>
      </aside>
    </>
  );
}
