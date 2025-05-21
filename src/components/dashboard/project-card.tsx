import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Progress } from "../ui/react-progress";

// Define the props type for ProjectCard
interface ProjectCardProps {
  title: string;
  status: "En cours" | "Planifiée";
  deadline: string;
  progress: number;
  members: string[];
  bgColor: string;
  className?: string; // Added to accept external className
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, status, deadline, progress, members, bgColor, className }) => {
  return (
    <Card className={`text-white rounded-xl shadow-lg ${bgColor} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Badge className={`text-xs ${status === "En cours" ? "bg-gray-300 text-black" : "bg-purple-300 text-white"}`}>{status}</Badge>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-white text-xs mb-2">Échéance: {deadline}</CardDescription>
        <div className="mb-2">
          <span className="text-xs text-white">Progression</span>
          <div className="flex items-center gap-2">
            <Progress value={progress} className="mt-1 h-2 bg-white/30" />
            <span className="text-xs text-white">{progress}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {members.map((member, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-white">
                <AvatarFallback className="bg-white text-black">{member}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <MoreHorizontal className="h-4 w-4 text-white" />
        </div>
      </CardContent>
    </Card>
  );
};

interface ProjectCardListProps {
  className?: string; // Added to accept external className
}

const ProjectCardList: React.FC<ProjectCardListProps> = ({ className }) => {
  return (
    <div className={`p-6 text-whiterounded-md border shadow h-full ${className}`}>
      <h2 className="text-xl font-bold mb-4">Mes Projets</h2>
      <div className="flex flex-col gap-4">
        <ProjectCard title="Refonte du site web" status="En cours" deadline="20 Juin" progress={65} members={["JD", "AB", "CD"]} bgColor="bg-blue-500" className="w-full" />
        <ProjectCard title="Application mobile" status="Planifiée" deadline="30 Juin" progress={10} members={["JD", "GH", "+2"]} bgColor="bg-purple-500" className="w-full" />
      </div>
    </div>
  );
};

export default ProjectCardList;
