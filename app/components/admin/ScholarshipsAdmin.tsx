'use client';

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  FileText, 
  LayoutGrid,
  Calendar,
  DollarSign,
  School,
  Globe,
  Bookmark
} from "lucide-react";
import RichTextEditor from "../RichTextEditor/RichTextEditor";

// Scholarship interface based on the MongoDB model
interface Scholarship {
  id: string;
  _id?: string;  // Support both formats
  title: string;
  description: string;
  summary: string;
  slug: string;
  university: string;
  country: string;
  amount: string;
  deadline: string;
  requirements: string;
  applicationLink: string;
  isFeatured: boolean;
  image?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Initial empty scholarship for creating new items
const emptyScholarship: Omit<Scholarship, 'id' | '_id'> = {
  title: "",
  description: "",
  summary: "",
  slug: "",
  university: "",
  country: "",
  amount: "",
  deadline: "",
  requirements: "",
  applicationLink: "",
  isFeatured: false,
  image: "",
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: []
  }
};

const ScholarshipsAdmin = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentScholarship, setCurrentScholarship] = useState<Scholarship | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editForm, setEditForm] = useState<Omit<Scholarship, 'id' | '_id'>>(emptyScholarship);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/scholarships');
      if (!response.ok) {
        throw new Error('Failed to fetch scholarships');
      }

      const data = await response.json();
      setScholarships(data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      toast({
        title: 'Error fetching scholarships',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditForm(emptyScholarship);
    setCurrentScholarship(null);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleEdit = (scholarship: Scholarship) => {
    setIsEditing(true);
    setEditForm(scholarship);
    setCurrentScholarship(scholarship);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleDelete = async (scholarshipId: string) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/scholarships/${scholarshipId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete scholarship');
      }

      // Update the UI by removing the deleted scholarship
      setScholarships(scholarships.filter(item => 
        (item._id !== scholarshipId && item.id !== scholarshipId)
      ));
      
      toast({
        title: 'Scholarship deleted',
        description: 'The scholarship has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting scholarship:', error);
      toast({
        title: 'Error deleting scholarship',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Make sure we have required fields
      if (!editForm.title || !editForm.description || !editForm.university) {
        throw new Error('Title, description, and university are required');
      }

      // Convert keywords from string to array if it's a string
      const submissionData = {
        ...editForm,
        seo: {
          ...editForm.seo,
          keywords: typeof editForm.seo.keywords === 'string' 
            ? editForm.seo.keywords.split(',').map(k => k.trim()).filter(Boolean) 
            : editForm.seo.keywords
        }
      };

      // Use the appropriate ID field (supporting both formats)
      const scholarshipId = currentScholarship?.id || currentScholarship?._id;
      const url = isEditing
        ? `/api/admin/scholarships/${scholarshipId}`
        : '/api/admin/scholarships';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save scholarship');
      }

      const savedScholarship = await response.json();
      
      if (isEditing) {
        // Update existing scholarship in the list
        setScholarships(scholarships.map(item => {
          // Handle both ID formats by comparing with both
          const matchesId = item.id === savedScholarship.id || item._id === savedScholarship._id;
          return matchesId ? savedScholarship : item;
        }));
      } else {
        // Add new scholarship to the list
        setScholarships([...scholarships, savedScholarship]);
      }
      
      setDialogOpen(false);
      toast({
        title: isEditing ? 'Scholarship updated' : 'Scholarship created',
        description: isEditing 
          ? 'The scholarship has been updated successfully' 
          : 'A new scholarship has been created successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving scholarship:', error);
      toast({
        title: 'Error saving scholarship',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const parentKey = parent as keyof typeof editForm;
      
      if (parentKey === 'seo') {
        setEditForm({
          ...editForm,
          seo: {
            ...editForm.seo,
            [child]: value
          }
        });
      } else {
        setEditForm({
          ...editForm,
          [parent]: {
            ...editForm[parentKey],
            [child]: value
          }
        });
      }
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditForm({
      ...editForm,
      [name]: checked
    });
  };
  
  const handleRichTextChange = (content: string) => {
    setEditForm({
      ...editForm,
      description: content
    });
  };

  const filteredScholarships = scholarships.filter(scholarship => 
    scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scholarships</h2>
          <p className="text-slate-500 mt-2">
            Manage scholarships for universities
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Scholarship
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search scholarships..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScholarships.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-slate-500 py-10">
                          No scholarships found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredScholarships.map((scholarship) => (
                        <TableRow key={scholarship.id || scholarship._id}>
                          <TableCell className="font-medium">{scholarship.title}</TableCell>
                          <TableCell>{scholarship.university}</TableCell>
                          <TableCell>{scholarship.country}</TableCell>
                          <TableCell>{scholarship.amount}</TableCell>
                          <TableCell>
                            {scholarship.deadline && 
                              new Date(scholarship.deadline).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {scholarship.isFeatured ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                No
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(scholarship)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDelete(scholarship.id || scholarship._id || "")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScholarships.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-10">
                  No scholarships found
                </div>
              ) : (
                filteredScholarships.map((scholarship) => (
                  <Card key={scholarship.id || scholarship._id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-ellipsis overflow-hidden whitespace-nowrap" title={scholarship.title}>
                        {scholarship.title}
                      </CardTitle>
                      <CardDescription className="flex justify-between">
                        <span>{scholarship.university}</span>
                        <span>{scholarship.country}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-2">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        <span>{scholarship.amount}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                        <span>
                          {scholarship.deadline && 
                            new Date(scholarship.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div>
                        {scholarship.isFeatured && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(scholarship)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(scholarship.id || scholarship._id || "")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Scholarship Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Scholarship" : "Create New Scholarship"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the scholarship"
                : "Add a new scholarship to your collection"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    placeholder="Scholarship title"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">University *</Label>
                    <Input
                      id="university"
                      name="university"
                      value={editForm.university}
                      onChange={handleInputChange}
                      placeholder="University name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={editForm.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      value={editForm.amount}
                      onChange={handleInputChange}
                      placeholder="e.g. $5,000 or Full Tuition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={editForm.deadline?.split('T')[0]}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary *</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={editForm.summary}
                    onChange={handleInputChange}
                    placeholder="Brief overview of the scholarship"
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Scholarship Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={editForm.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={editForm.isFeatured}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('isFeatured', checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="isFeatured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Feature this scholarship (will be displayed prominently)
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <RichTextEditor
                    content={editForm.description}
                    onChange={handleRichTextChange}
                    placeholder="Start writing detailed scholarship information..."
                    className="min-h-[400px]"
                  />
                  <p className="text-xs text-slate-500">
                    Provide detailed information about the scholarship, eligibility, benefits, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={editForm.requirements}
                    onChange={handleInputChange}
                    placeholder="List of requirements for this scholarship"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicationLink">Application Link</Label>
                  <Input
                    id="applicationLink"
                    name="applicationLink"
                    value={editForm.applicationLink}
                    onChange={handleInputChange}
                    placeholder="https://example.com/apply"
                  />
                </div>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo.metaTitle">Meta Title</Label>
                <Input
                  id="seo.metaTitle"
                  name="seo.metaTitle"
                  value={editForm.seo.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO title (if different from scholarship title)"
                />
                <p className="text-xs text-slate-500">
                  If left empty, the scholarship title will be used
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.metaDescription">Meta Description</Label>
                <Textarea
                  id="seo.metaDescription"
                  name="seo.metaDescription"
                  value={editForm.seo.metaDescription}
                  onChange={handleInputChange}
                  placeholder="SEO description"
                  rows={3}
                />
                <p className="text-xs text-slate-500">
                  If left empty, the scholarship summary will be used
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.keywords">Keywords</Label>
                <Input
                  id="seo.keywords"
                  name="seo.keywords"
                  value={Array.isArray(editForm.seo.keywords) 
                    ? editForm.seo.keywords.join(', ') 
                    : editForm.seo.keywords
                  }
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-slate-500">
                  Comma-separated list of keywords
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={editForm.slug}
                  onChange={handleInputChange}
                  placeholder="scholarship-url-slug"
                  required
                />
                <p className="text-xs text-slate-500">
                  The slug will be used in the scholarship URL (e.g., /scholarships/scholarship-url-slug)
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update Scholarship" : "Create Scholarship"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScholarshipsAdmin;