"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Trash2, Eye } from "lucide-react";
import { verifyPayment, deleteRegistration } from "@/app/actions/registration";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function DeleteButton({ id, onDelete }: { id: string, onDelete: (id: string) => void }) {
  const [confirm, setConfirm] = useState(false);

  return (
    <Button 
      variant={confirm ? "destructive" : "outline"} 
      size="sm" 
      onClick={() => {
        if (confirm) {
          onDelete(id);
        } else {
          setConfirm(true);
          setTimeout(() => setConfirm(false), 3000);
        }
      }}
      className={`transition-all duration-300 ${confirm ? 'w-32' : 'w-10'}`}
    >
      {confirm ? "Confirm Delete" : <Trash2 className="w-4 h-4 text-red-500" />}
    </Button>
  );
}

export function RegistrationsList({ registrations }: { registrations: any[] }) {
  // Group by Event -> SportType
  const grouped = registrations.reduce((acc, reg) => {
    const eventKey = `${reg.event.title}`;
    const categoryKey = `${reg.sportType}`;
    
    if (!acc[eventKey]) acc[eventKey] = {};
    if (!acc[eventKey][categoryKey]) acc[eventKey][categoryKey] = [];
    
    acc[eventKey][categoryKey].push(reg);
    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVerify = async (id: string) => {
    await verifyPayment(id);
  };

  const handleDelete = async (id: string) => {
    await deleteRegistration(id);
  };

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border">
        <p className="text-muted-foreground">No registrations found yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([eventName, categories]) => (
        <div key={eventName} className="space-y-4">
          <h2 className="text-2xl font-black text-primary border-b pb-2">{eventName}</h2>
          
          {Object.entries(categories as Record<string, any[]>).map(([sportCategory, regs]) => {
            const groupKey = `${eventName}-${sportCategory}`;
            const isExpanded = expandedGroups[groupKey];
            
            return (
              <div key={groupKey} className="border rounded-xl bg-white overflow-hidden shadow-sm">
                <div 
                  className="bg-muted/30 p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleGroup(groupKey)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-primary" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                    <h3 className="text-lg font-bold">Event & Category: <span className="text-primary">{sportCategory}</span></h3>
                    <Badge variant="secondary" className="ml-2 font-bold">{regs.length} Registrations</Badge>
                  </div>
                </div>

                {isExpanded && (
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow>
                        <TableHead>Registration ID</TableHead>
                        <TableHead>Participant / Team</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Sub-Category</TableHead>
                        <TableHead>Payment Mode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regs.map((reg: any) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-mono font-bold">{reg.registrationNo}</TableCell>
                          <TableCell className="font-bold">
                            {reg.user.isTeamRegistration ? (
                              <span className="text-blue-600">Team: {reg.user.teamName}</span>
                            ) : (
                              reg.user.name
                            )}
                          </TableCell>
                          <TableCell>{reg.user.phone}</TableCell>
                          <TableCell>{reg.sportSubCategory} ({reg.ageGroup})</TableCell>
                          <TableCell>
                            {reg.paymentProofUrl ? (
                              <Dialog>
                                <DialogTrigger className="text-blue-500 hover:underline font-bold text-sm flex items-center gap-1">
                                  <Eye className="w-4 h-4" /> View UPI Proof
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Payment Screenshot</DialogTitle>
                                  </DialogHeader>
                                  <img src={reg.paymentProofUrl} alt="Proof" className="w-full h-auto rounded-lg" />
                                  {reg.paymentStatus === "PENDING" && (
                                    <Button onClick={() => handleVerify(reg.id)} className="w-full font-bold">Verify & Approve</Button>
                                  )}
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <span className="text-muted-foreground font-medium">Pay at Venue</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={reg.paymentStatus === "VERIFIED" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"}>
                              {reg.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            {reg.paymentStatus === "PENDING" && (
                              <Button size="sm" variant="secondary" onClick={() => handleVerify(reg.id)}>Approve</Button>
                            )}
                            <DeleteButton id={reg.id} onDelete={handleDelete} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
