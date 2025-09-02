import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Warehouse, Calculator, BookOpen } from "lucide-react";


export default function Calculate() {
  const cards = [
    {
      title: "Check Serviceability",
      description: "Check if we deliver to your location",
      icon: <Warehouse className="w-8 h-8 text-primary" />,
      link: "/user/calculator/serviceability",
    },
    {
      title: "Calculate Rate ",
      description: "Calculate and compare shipping rates instantly",
      icon: <Calculator className="w-8 h-8 text-primary" />,
      link: "/user/calculator/rate-calculator",
    },
    {
      title: "Rate Sheet",
      description: "Download our complete rate sheet",
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      link: "/user/calculator/rate-sheet",
    },
  ];


  return (
    <Card className="w-full h-full flex justify-center gap-8 py-12">
      {cards.map((card, idx) => (
        <Link href={card.link} key={idx}>
          <button
            key={card.title}
            className="p-0"
            onClick={card.onClick}
            type="button"
          >
            <Card className="group relative overflow-hidden p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  {card.icon}
                </div>
                <h2 className="text-2xl font-semibold text-center">
                  {card.title}
                </h2>
                <p className="text-muted-foreground text-center">
                  {card.description}
                </p>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-600 rounded-xl transition-colors" />
            </Card>
          </button>
        </Link>
        ))}
    </Card>
  );
}
