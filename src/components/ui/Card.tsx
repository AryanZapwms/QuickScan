import * as React from "react"
import { cn } from "@/lib/utils"
import Button from "./Button"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Wrapper for Services to maintain backward compatibility for now
interface ServiceCardProps {
  service: {
    id: string | number;
    name: string;
    originalPrice: number;
    discountedPrice: number;
    features: string[];
    image?: string;
    isPopular?: boolean;
  };
  onBook: () => void;
}

export const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  return (
    <Card className="hover:border-primary/50 transition duration-300">
      {/* {service.isPopular && (
        <div className="bg-primary text-primary-foreground text-xs font-semibold py-1 px-3 absolute top-4 left-4 rounded-full z-10">
          Popular
        </div>
      )} */}
      
      {service.image && (
        <div className="h-48 bg-muted flex items-center justify-center border-b">
          <div className="text-4xl">🩺</div>
        </div>
      )}
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-3">{service.name}</h3>
        
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-primary">
            ₹{service.discountedPrice}
          </span>
          {service.originalPrice > service.discountedPrice && (
            <>
              <span className="text-muted-foreground line-through ml-3 text-sm">
                ₹{service.originalPrice}
              </span>
              <span className="text-green-600 text-sm font-semibold ml-3">
                Save ₹{service.originalPrice - service.discountedPrice}
              </span>
            </>
          )}
        </div>
        
        <ul className="space-y-2 mb-6">
          {service.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-muted-foreground">
              <span className="text-primary mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={onBook} 
          variant="default" 
          className="w-full"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
export default Card