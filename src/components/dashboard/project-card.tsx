import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import * as Progress from "@radix-ui/react-progress";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export function ProjectCardList() {
  const [progress1, setProgress1] = React.useState(13);
  const [progress2, setProgress2] = React.useState(40);

  React.useEffect(() => {
    const timer1 = setTimeout(() => setProgress1(66), 500);
    const timer2 = setTimeout(() => setProgress2(80), 500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div>
      <Card className="w-full  border-2 rounded-lg shadow-lg mb-12">
        <CardHeader className="p-6">
          <div className="flex justify-between items-center">
            <CardTitle>Create project</CardTitle>
            <Badge>Active</Badge>
          </div>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 mb-2">
                <Label htmlFor="name">Progression</Label>
              </div>
            </div>
          </form>
          <Progress.Root className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200" value={progress1}>
            <Progress.Indicator className="h-full w-full bg-blue-500 transition-all" style={{ transform: `translateX(-${100 - progress1}%)` }} />
          </Progress.Root>
        </CardContent>
        <CardFooter className="flex justify-start p-3">
          <div className="flex -space-x-2.5">
            <Avatar className="w-8 h-8 md:w-10 md:h-10 dark:bg-muted   flex items-center justify-center rounded-full">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 md:w-10 md:h-10 dark:bg-muted  flex items-center justify-center rounded-full">
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 md:w-10 md:h-10 dark:bg-muted   flex items-center justify-center rounded-full">
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
          </div>
        </CardFooter>
      </Card>

      <Card className="w-full  border-2 rounded-lg shadow-lg">
        <CardHeader className="p-6">
          <div className="flex justify-between items-center">
            <CardTitle>Update project</CardTitle>
            <Badge>Pending</Badge>
          </div>
          <CardDescription>Update your project with ease.</CardDescription>
        </CardHeader>
        <CardContent className="p-3">
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 mb-2">
                <Label htmlFor="name">Progression</Label>
              </div>
            </div>
          </form>
          <Progress.Root className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200" value={progress2}>
            <Progress.Indicator className="h-full w-full bg-blue-500 transition-all" style={{ transform: `translateX(-${100 - progress2}%)` }} />
          </Progress.Root>
        </CardContent>
        <CardFooter className="flex justify-start p-3">
          <div className="flex -space-x-2.5">
            <Avatar className="w-8 h-8 md:w-10 md:h-10 dark:bg-muted   flex items-center justify-center rounded-full">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 md:w-10 md:h-10 dark:bg-muted   flex items-center justify-center rounded-full">
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 md:w-10 md:h-10 dark:bg-muted   flex items-center justify-center rounded-full">
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ProjectCardList;
